import { Client, GroupMessageEvent, ImageElem, PrivateMessageEvent, Sendable, TextElem } from "oicq";
import { signc } from "../config/config";
import { githelpData } from "./app/help/help";
import { sign } from "./app/sigm/sign";
import { HtmlImg } from "./puppeteer";

async function friend(event: PrivateMessageEvent, Bot: Client) {
    let cmd = await event.message.find(msg => msg.type === 'text') as TextElem
    friendcmd(event, cmd?.text ?? "", Bot)
}
async function group(event: GroupMessageEvent, Bot: Client) {
    let cmd = await event.message.find(msg => msg.type === 'text') as TextElem
    groupcmd(event, cmd?.text ?? "", Bot)
}

async function friendcmd(event: PrivateMessageEvent, msg: string, Bot: Client,) {
    if (new RegExp("#?帮助$", "m").test(msg)) {
        Bot.logger.info("收到指令：" + msg)
        event.friend.sendMsg({ type: 'image', file: `base64://${await HtmlImg("help", await githelpData(Bot))}` })
    } else if (new RegExp("#?签到$", "m").test(msg)) {
        Bot.logger.info("收到指令：" + msg)
        if (signc.Issign) {
            event.friend.sendMsg({ type: 'image', file: `base64://${await HtmlImg("sign", await sign(event.friend.user_id, event.nickname))}` })
        }

    }
}
async function groupcmd(event: GroupMessageEvent, msg: string, Bot: Client) {
    if (new RegExp("#?帮助$", "m").test(msg)) {
        Bot.logger.info("收到指令：" + msg)
        event.group.sendMsg({ type: 'image', file: `base64://${await HtmlImg("help", await githelpData(Bot))}` })
    } else if (new RegExp("#?签到$", "m").test(msg)) {
        Bot.logger.info("收到指令：" + msg)
        if (signc.Issign) {
            event.group.sendMsg({ type: 'image', file: `base64://${await HtmlImg("sign", await sign(event.member.uid, event.nickname))}` })
        }
    }
}
export { friend, group };


