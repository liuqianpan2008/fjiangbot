import { Client, ImageElem, PrivateMessageEvent, Sendable, TextElem } from "oicq";
import { HtmlImg } from "./puppeteer";

async function friend(event: PrivateMessageEvent, Bot: Client) {
    let cmd = await event.message.find(msg => msg.type === 'text') as TextElem

    await friendcmd(event, cmd.text, Bot, "#?帮助$", { type: 'image', file: `base64://${await HtmlImg("help", { title: "cs" })}` })
    // await friendcmd(event, cmd.text, Bot, "#?帮助$", 
    // )
}
function friendcmd(event: PrivateMessageEvent, msg: string, Bot: Client, cod: string, message: Sendable) {
    let cmd: RegExp = new RegExp(cod, "m");
    if (cmd.test(msg)) {
        Bot.logger.info("收到指令：" + msg)
        event.friend.sendMsg(message)
    }
}
export { friend };


