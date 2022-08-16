import { AtElem, Client, GroupMessageEvent, PrivateMessageEvent, TextElem } from "oicq";
import { admins, groupc, signc } from "../config/config";
import { groupFriends } from "./app/groupcod";
import { githelpData } from "./app/help/help";
import { rules, runplugin } from "./app/plugin";
import { userprop } from "./app/props";
import { buyshop, goods, userinfo } from "./app/shop";
import { sign } from "./app/sign";
import { HtmlImg } from "./puppeteer";
async function message(event: PrivateMessageEvent | GroupMessageEvent, Bot: Client) {
    let msg = event.message
    msg.forEach(async (item) => {
        switch (item.type) {
            case "text": (async () => {
                rules("#?帮助$", item, async () => {
                    event.reply({ type: 'image', file: `base64://${await HtmlImg("help", await githelpData(Bot))}` })
                })
                rules("#?签到$", item, async () => {
                    if (signc.Issign) {
                        event.reply({ type: 'image', file: `base64://${await HtmlImg("sign", await sign(event.sender.user_id, event.nickname), event.sender.user_id)}` })
                    }
                })
                rules("#?枫酱超市$", item, async () => {
                    event.reply({ type: 'image', file: `base64://${await HtmlImg("shop", goods(event.sender.user_id, Bot))}` })
                })
                rules("#?个人仓库$", item, async () => {
                    event.reply({ type: 'image', file: `base64://${await HtmlImg("shop", userinfo(event.sender.user_id), event.sender.user_id)}` })
                })
                rules("#?购买道具(.*)$", item, async () => {
                    let goodsid = item.text.split("具")[1]
                    await event.reply(buyshop(event.sender.user_id, Number(goodsid)))
                    event.reply({ type: 'image', file: `base64://${await HtmlImg("shop", userinfo(event.sender.user_id), event.sender.user_id)}` })
                })
                userprop(event, Bot);
                runplugin(event, item);
            })()
        }
    })
}

async function group(event: GroupMessageEvent, Bot: Client) {
    groupValidation(event, Bot)
    groupAt(event, Bot)
}
async function groupValidation(event: GroupMessageEvent, Bot: Client) {
    let msg = event.message.find(msg => msg.type === 'text') as TextElem
    if (new RegExp("#?验证(.*)", "m").test(msg?.text ?? "")) {
        let yz = msg.text.split("证")[1]
        Bot.logger.info("收到指令：验证码" + yz)
        if (groupFriends.get(event.group_id)) {
            let friends = groupFriends.get(event.group_id)
            if (friends?.find(friend => friend.id === event.member.uid)?.cod == yz) {
                delete groupFriends.get(event.group_id)?.[friends?.findIndex(friend => friend.id === event.member.uid)]
                event.group.sendMsg({ type: 'text', text: "验证通过，欢迎来QAQ聊天" })
                console.log(groupFriends);
            } else {
                event.group.sendMsg({ type: 'text', text: "验证失败，请重新输入" })
            }
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
            event.group.is_admin &&
            ((c?.Isadmin ? event.member.is_admin : true) || admins.find(item => { return item === event.member.uid })) &&
            !event.group.pickMember(msgAt.qq as number).is_admin
        ) {
            let mags = event.message
            mags.splice(mags.findIndex(msg => msg.type === 'at'), 1)
            // 去除空格
            let time = Number((mags[1] as TextElem).text.trim())
            if (time !== 0) {
                await event.group.muteMember(msgAt.qq as number, time)
                await event.group.sendMsg(`已经对${msgAt.text}禁言${time}秒`)
            } else {
                await event.group.muteMember(msgAt.qq as number, 3600)
                await event.group.sendMsg(`已经对${msgAt.text}禁言${3600}秒`)
            }

        } else {
            await event.group.sendMsg("条件不满足")
        }
    }
    if (new RegExp("#?解$", "m").test(msgT?.text ?? "")) {
        Bot.logger.info("收到指令：解")
        if (
            msgAt &&
            event.group.is_admin &&
            ((c?.Isadmin ? event.member.is_admin : true) || admins.find(item => { return item === event.member.uid }))
        ) {
            await event.group.muteMember(msgAt.qq as number, 0)
            await event.group.sendMsg(`已经解除 ${msgAt.text} 的禁言`)
        } else {
            await event.group.sendMsg("条件不满足")
        }
    }
    if (new RegExp("#?ban$", "m").test(msgT?.text ?? "")) {
        Bot.logger.info("收到指令：ban")
        if (
            msgAt &&
            event.group.is_admin &&
            ((c?.Isadmin ? event.member.is_admin : true) || admins.find(item => { return item === event.member.uid })) &&
            !event.group.pickMember(msgAt.qq as number).is_admin
        ) {
            if (await event.group.kickMember(msgAt.qq as number, true)) {
                await event.group.sendMsg("已经踢出" + msgAt.qq)
            } else {
                await event.group.sendMsg("发生错误，踢出失败！")
            }

        } else {
            await event.group.sendMsg("条件不满足")
        }
    }
}
// 食用道具
export { group, message };