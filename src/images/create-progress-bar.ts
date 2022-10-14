import { CanvasRenderingContext2D } from "canvas"
import { statsType } from "../image"
import { colors } from "../colors"

export const progressBar = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    { CURRENT, COMPLETED, PAUSED, DROPPED, PLANNING }: statsType,
) => {
    const total = CURRENT + COMPLETED + PAUSED + DROPPED + PLANNING
    const cur = CURRENT / total
    const com = cur + COMPLETED / total
    const pas = com + PAUSED / total
    const dro = pas + DROPPED / total

    ctx.lineWidth = 1

    const pi = Math.PI
    const r = h / 2

    ctx.save()

    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arc(x + r, y + r, r, pi * 1.5, pi * 0.5, true)
    ctx.lineTo(x + w - r, y + h)
    ctx.arc(x + w - r, y + h - r, r, pi * 0.5, pi * 1.5, true)
    ctx.lineTo(x + r, y)
    ctx.closePath()
    ctx.stroke()
    ctx.clip()

    const drawPart = (amount: number, color: string) => {
        ctx.beginPath()

        const width = w * amount > w ? w : w * amount
        ctx.moveTo(x + r, y)
        ctx.arc(x + r, y + r, r, pi * 1.5, pi * 0.5, true)
        ctx.lineTo(x + width - r, y + h)
        ctx.arc(x + width - r, y + h - r, r, pi * 0.5, pi * 1.5, true)
        ctx.lineTo(x + r, y)

        ctx.closePath()
        ctx.fillStyle = color
        ctx.fill()
        ctx.stroke()
    }

    drawPart(1, colors.PLANNING)
    drawPart(dro, colors.DROPPED)
    drawPart(pas, colors.PAUSED)
    drawPart(com, colors.COMPLETED)
    drawPart(cur, colors.CURRENT)

    ctx.restore()
}
