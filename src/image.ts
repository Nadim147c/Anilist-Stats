import fs from "fs"
import { createCanvas, registerFont, loadImage } from "canvas"
import { Client, MediaListCollection, User } from "anilist-wrapper"
import { progressBar } from "./images/create-progress-bar"
import { writeListCount } from "./images/write-list-count"
import { fitCover } from "./images/fit-cover"
import { formatNum } from "./images/format-number"
import { colors } from "./colors"

export type statsType = { CURRENT: number; COMPLETED: number; PAUSED: number; DROPPED: number; PLANNING: number }
export const updateImage = async () => {
    const client = new Client(process.env.userToken)

    console.log("Fetching user")
    const user = (await client.fetchUser().catch(console.error)) as User
    console.log("Fetching anime list")
    const animeList = (await client.fetchUserAnimeList().catch(console.error)) as MediaListCollection
    console.log("Fetching manga list")
    const mangaList = (await client.fetchUserMangaList().catch(console.error)) as MediaListCollection

    const animeCount = {} as statsType
    animeList.lists.forEach((list) => (animeCount[list.status] = list.entries.length))

    const mangaCount = {} as statsType
    mangaList.lists.forEach((list) => (mangaCount[list.status] = list.entries.length))

    const stats = user.statistics

    registerFont("./fonts/RUBIK.ttf", { family: "Rubik" })

    const canvas = createCanvas(500, 300)
    const ctx = canvas.getContext("2d")

    try {
        const imgURL = user.bannerImage ?? user.avatar?.large ?? "./images/bg.jpg"
        const image = await loadImage(imgURL)
        fitCover(canvas, ctx, image)
    } catch (error) {
        // ignore lol
    }

    ctx.fillStyle = colors.bg

    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = colors.accent
    ctx.font = "22px Rubik"
    ctx.textAlign = "center"

    let animeY = canvas.height / 5
    const x = canvas.width / 5
    ctx.fillText(stats.anime.count.toString(), x, animeY)
    ctx.fillText((stats.anime.minutesWatched / (60 * 24)).toFixed(2), x * 2, animeY)
    ctx.fillText(formatNum(stats.anime.episodesWatched), x * 3, animeY)
    ctx.fillText(stats.anime.meanScore.toString(), x * 4, animeY)

    let mangaY = (canvas.height / 5) * 3.5
    ctx.fillText(stats.manga.count.toString(), x, mangaY)
    ctx.fillText(formatNum(stats.manga.volumesRead), x * 2, mangaY)
    ctx.fillText(formatNum(stats.manga.chaptersRead), x * 3, mangaY)
    ctx.fillText(stats.manga.meanScore.toString(), x * 4, mangaY)

    ctx.font = "12px Rubik"
    ctx.fillStyle = "white"
    animeY += 18
    ctx.fillText("Anime", x, animeY)
    ctx.fillText("Days", x * 2, animeY)
    ctx.fillText("Episodes", x * 3, animeY)
    ctx.fillText("Main Score", x * 4, animeY)

    mangaY += 18
    ctx.fillText("Manga", x, mangaY)
    ctx.fillText("Volumes", x * 2, mangaY)
    ctx.fillText("Chapters", x * 3, mangaY)
    ctx.fillText("Main Score", x * 4, mangaY)

    progressBar(ctx, 10, canvas.height / 2 - 10, canvas.width - 20, 15, animeCount)
    writeListCount(ctx, canvas.width / 2, canvas.height / 2 - 20, animeCount)

    progressBar(ctx, 10, canvas.height - 30, canvas.width - 20, 15, mangaCount)
    writeListCount(ctx, canvas.width / 2, canvas.height - 40, mangaCount)

    fs.writeFileSync("./images/render.png", canvas.toBuffer())
    console.log("Image Has been updated.")
}
