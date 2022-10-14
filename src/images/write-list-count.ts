import { CanvasRenderingContext2D } from "canvas"
import { statsType } from "../image"
import { colors } from "../colors"

export const writeListCount = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    { CURRENT, COMPLETED, PAUSED, DROPPED, PLANNING }: statsType,
) => {
    const currentText = `${CURRENT} Current`
    const completedText = `${COMPLETED} Completed`
    const pausedText = `${PAUSED} Paused`
    const droppedText = `${DROPPED} Dropped`
    const planningText = `${PLANNING} Planning`
    const text = [currentText, completedText, pausedText, droppedText, planningText].join(" | ")

    const length = ctx.measureText(text).width
    let xCoordinate = x - length / 2
    let spliter = ctx.measureText(" | ").width
    ctx.textAlign = "left"

    /**
     * @param {string} text
     * @param {string} style
     */
    const printText = (text, style) => {
        ctx.fillStyle = style
        ctx.fillText(text, xCoordinate, y)
        xCoordinate += ctx.measureText(text).width
    }

    const split = () => {
        ctx.fillStyle = "white"
        ctx.fillText(" | ", xCoordinate, y)
        xCoordinate += spliter
    }

    printText(currentText, colors.CURRENT)
    split()
    printText(completedText, colors.COMPLETED)
    split()
    printText(pausedText, colors.PAUSED)
    split()
    printText(droppedText, colors.DROPPED)
    split()
    printText(planningText, colors.PLANNING)
}
