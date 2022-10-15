import { createCanvas, loadImage } from "canvas"
import fs from "fs"

export const getImage = async (url: string) => {
    const localPath = `images/${url.split("/").pop()}`
    const cached = fs.existsSync(localPath)
    if (cached) url = localPath
    const image = await loadImage(url)

    if (!cached) {
        const canvas = createCanvas(image.width, image.height)
        const ctx = canvas.getContext("2d")
        ctx.drawImage(image, 0, 0)
        fs.writeFileSync(localPath, canvas.toBuffer())
    }

    return image
}
