import { Client, GroupMessageEvent, PrivateMessageEvent, Sendable, TextElem } from "oicq";
import { githelpData } from "./app/help/help";
import { HtmlImg } from "./puppeteer";

async function friend(event: PrivateMessageEvent, Bot: Client) {
    let cmd = await event.message.find(msg => msg.type === 'text') as TextElem
    await friendcmd(event, cmd.text, Bot, "#?帮助$", { type: 'image', file: `base64://${await HtmlImg("help", await githelpData(Bot))}` })
}
async function group(event: GroupMessageEvent, Bot: Client) {
    let cmd = await event.message.find(msg => msg.type === 'text') as TextElem
    await groupcmd(event, cmd?.text ?? "", Bot, "#?帮助$", { type: 'image', file: `base64://${await HtmlImg("help", await githelpData(Bot))}` })
}

function friendcmd(event: PrivateMessageEvent, msg: string, Bot: Client, cod: string, message: Sendable) {
    let cmd: RegExp = new RegExp(cod, "m");
    if (cmd.test(msg)) {
        Bot.logger.info("收到指令：" + msg)
        event.friend.sendMsg(message)
    }
}
function groupcmd(event: GroupMessageEvent, msg: string, Bot: Client, cod: string, message: Sendable) {
    let cmd: RegExp = new RegExp(cod, "m");
    if (cmd.test(msg)) {
        Bot.logger.info("收到指令：" + msg)
        event.group.sendMsg(message)
    }
}

export { friend, group };


