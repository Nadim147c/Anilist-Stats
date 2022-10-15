import fs from "fs"
import { createCanvas, registerFont, loadImage } from "canvas"
import { Client, MediaListCollection, User } from "anilist-wrapper"
import { progressBar } from "./images/create-progress-bar"
import { writeListCount } from "./images/write-list-count"
import { fitCover } from "./images/fit-cover"
import { formatNum } from "./images/format-number"
import { colors } from "./colors"
import { getImage } from "./images/get-image"

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
        const image = await getImage(imgURL)
        fitCover(canvas, ctx, image)
    } catch (error) {
        // ignore lol
    }

    try {
        const image = await loadImage("images/overlay.png")
        ctx.drawImage(image, 0, 0)
    } catch (error) {
        //ignore again lol
    }

    ctx.fillStyle = colors.accent
    ctx.font = "22px Rubik"
    ctx.textAlign = "center"

    let animeY = canvas.height / 5
    const x = canvas.width / 5
    ctx.fillText(stats.anime.count.toString(), x, animeY)
    ctx.fillText((stats.anime.minutesWatched / (60 * 24)).toFixed(2), x * 2, animeY)
    ctx.fillText(formatNum(stats.anime.episodesWatched), x * 3, animeY)
    ctx.fillText((stats.anime.meanScore / 10).toFixed(1), x * 4, animeY)

    let mangaY = (canvas.height / 6) * 4
    ctx.fillText(stats.manga.count.toString(), x, mangaY)
    ctx.fillText(formatNum(stats.manga.volumesRead), x * 2, mangaY)
    ctx.fillText(formatNum(stats.manga.chaptersRead), x * 3, mangaY)
    ctx.fillText((stats.manga.meanScore / 10).toFixed(1), x * 4, mangaY)

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

    progressBar(ctx, 30, canvas.height / 2 - 35, canvas.width - 60, 15, animeCount)
    writeListCount(ctx, canvas.width / 2, canvas.height / 2 - 45, animeCount)

    progressBar(ctx, 30, canvas.height - 40, canvas.width - 60, 15, mangaCount)
    writeListCount(ctx, canvas.width / 2, canvas.height - 50, mangaCount)

    fs.writeFileSync("./images/render.png", canvas.toBuffer())
    console.log("Image Has been updated.")
}
