import { AtElem, Client, GroupMessageEvent, ImageElem, MessageElem, PrivateMessageEvent, Sendable, TextElem } from "oicq";
import { admins, groupc, signc } from "../config/config";
import { githelpData } from "./app/help/help";
import { sign } from "./app/sign";
import { HtmlImg } from "./puppeteer";

async function friend(event: PrivateMessageEvent, Bot: Client) {
    friendText(event, Bot)
}
async function group(event: GroupMessageEvent, Bot: Client) {
    groupText(event, Bot)
    groupAt(event, Bot)
}
//处理单一文字指令
async function friendText(event: PrivateMessageEvent, Bot: Client) {
    let msg = event.message.find(msg => msg.type === 'text') as TextElem
    if (new RegExp("#?帮助$", "m").test(msg?.text ?? "")) {
        Bot.logger.info("收到指令：" + msg)
        event.friend.sendMsg({ type: 'image', file: `base64://${await HtmlImg("help", await githelpData(Bot))}` })
    } else if (new RegExp("#?签到$", "m").test(msg?.text ?? "")) {
        Bot.logger.info("收到指令：" + msg)
        if (signc.Issign) {
            event.friend.sendMsg({ type: 'image', file: `base64://${await HtmlImg("sign", await sign(event.friend.user_id, event.nickname))}` })
        }
    }
}
async function groupText(event: GroupMessageEvent, Bot: Client) {
    let msg = event.message.find(msg => msg.type === 'text') as TextElem
    if (new RegExp("#?帮助$", "m").test(msg?.text ?? "")) {
        Bot.logger.info("收到指令：帮助")
        event.group.sendMsg({ type: 'image', file: `base64://${await HtmlImg("help", await githelpData(Bot))}` })
    } else if (new RegExp("#?签到$", "m").test(msg?.text ?? "")) {
        Bot.logger.info("收到指令：签到")
        if (signc.Issign) {
            event.group.sendMsg({ type: 'image', file: `base64://${await HtmlImg("sign", await sign(event.member.uid, event.nickname))}` })
        }
    }
}
async function groupAt(event: GroupMessageEvent, Bot: Client) {
    let msgT = event.message.find(msg => msg.type === 'text') as TextElem
    let msgAt = event.message.find(msg => msg.type === 'at') as AtElem
    let c = groupc.get(event.group_id) ?? groupc.get(1)
    if (new RegExp("#?禁$", "m").test(msgT?.text ?? "")) {
        Bot.logger.info("收到指令：禁")
        if (
            msgAt &&
                admins.findIndex(item => { return item === event.member.uid }) != -1 &&
                event.group.is_admin &&
                c?.Isadmin ? event.member.is_admin : true &&
            event.group.pickMember(msgAt.qq as number).is_admin
        ) {
            await event.group.pickMember(msgAt.qq as number).mute(86400)
            await event.group.sendMsg(`已经禁言 ${msgAt.qq}`)
        } else {
            await event.group.sendMsg("条件不满足")
        }
    }
    if (new RegExp("#?解$", "m").test(msgT?.text ?? "")) {
        Bot.logger.info("收到指令：解")

        if (
            msgAt &&
                admins.findIndex(item => { return item === event.member.uid }) != -1 &&
                event.group.is_admin &&
                event.group.pickMember(msgAt.qq as number).mute_left > 0 &&
                c?.Isadmin ? event.member.is_admin : true
        ) {
            await event.group.muteMember(msgAt.qq as number, 0)
            await event.group.sendMsg(`已经解除 ${msgAt.qq} 的禁言`)
        } else {
            await event.group.sendMsg("条件不满足")
        }
    }
    if (new RegExp("#?ban$", "m").test(msgT?.text ?? "")) {
        Bot.logger.info("收到指令：ban")
        if (
            msgAt &&
                admins.findIndex(item => { return item === event.member.uid }) != -1 &&
                event.group.is_admin &&
                c?.Isadmin ? event.member.is_admin : true &&
            event.group.pickMember(msgAt.qq as number).is_admin
        ) {
            await event.group.kickMember(msgAt.qq as number, true)
            await event.group.sendMsg("已经踢出" + msgAt.qq)
        } else {
            await event.group.sendMsg("条件不满足")
        }
    }
}

export { friend, group };


