import express from "express"
import { config } from "dotenv"
import schedule from "node-schedule"
config()
import { updateImage } from "./image"

try {
    const job = schedule.scheduleJob("update", "0 22 * * *", updateImage)
} catch (error) {
    console.error(error)
}

const server = express()

server.get("/", (_: any, res: any) => {
    res.setHeader("Content-Type", "text/html")
    res.write(`<h1>Hosting is active</h1>`)
    res.end()
})

server.get("/image", (req, res) => {
    res.sendFile(`images/render.png`, { root: __dirname + "/.." })
})

server.listen(3001, () => console.log(`http://localhost:3000/image`))
