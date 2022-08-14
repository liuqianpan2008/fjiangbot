import { AtElem, Client, Group, GroupMessageEvent, ImageElem, MessageElem, PrivateMessageEvent, Sendable, TextElem } from "oicq";
import { admins, cdkT, groupc, groupT, propT, signc } from "../config/config";
import { groupFriends } from "./app/groupcod";
import { githelpData } from "./app/help/help";
import { addprops, buyshop, goods, uedcdk, userinfo, userprops } from "./app/shop";
import { sign } from "./app/sign";
import { HtmlImg } from "./puppeteer";

async function friend(event: PrivateMessageEvent, Bot: Client) {
    friendText(event, Bot)
    userpropsf(event, Bot)
}
async function group(event: GroupMessageEvent, Bot: Client) {
    groupText(event, Bot)
    groupAt(event, Bot)
    userpropsg(event, Bot)
}
//处理单一文字指令
async function friendText(event: PrivateMessageEvent, Bot: Client) {
    let msg = event.message.find(msg => msg.type === 'text') as TextElem
    if (new RegExp("#?帮助$", "m").test(msg?.text ?? "")) {
        Bot.logger.info("收到指令：" + msg.text)
        event.friend.sendMsg({ type: 'image', file: `base64://${await HtmlImg("help", await githelpData(Bot))}` })
    } else if (new RegExp("#?签到$", "m").test(msg?.text ?? "")) {
        Bot.logger.info("收到指令：" + msg.text)
        if (signc.Issign) {
            event.friend.sendMsg({ type: 'image', file: `base64://${await HtmlImg("sign", await sign(event.friend.user_id, event.nickname), event.sender.user_id)}` })
        }
    } else if (new RegExp("#?枫酱超市$", "m").test(msg?.text ?? "")) {
        Bot.logger.info("收到指令：" + msg.text)
        event.friend.sendMsg({ type: 'image', file: `base64://${await HtmlImg("shop", goods(event.friend.uid, Bot))}` })
    } else if (new RegExp("#?个人仓库$", "m").test(msg?.text ?? "")) {
        Bot.logger.info("收到指令：" + msg.text)
        event.friend.sendMsg({ type: 'image', file: `base64://${await HtmlImg("shop", userinfo(event.sender.user_id), event.sender.user_id)}` })
    } else if (new RegExp("#?购买道具(.*)$", "m").test(msg?.text ?? "")) {
        Bot.logger.info("收到指令：" + msg.text)
        if (signc.Issign) {
            let goodsid = msg.text.split("具")[1]
            await event.friend.sendMsg(buyshop(event.sender.user_id, Number(goodsid)))
            event.friend.sendMsg({ type: 'image', file: `base64://${await HtmlImg("shop", userinfo(event.sender.user_id), event.sender.user_id)}` })
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
            event.group.sendMsg({ type: 'image', file: `base64://${await HtmlImg("sign", await sign(event.member.uid, event.nickname), event.sender.user_id)}` })
        }
    } else if (new RegExp("#?验证(.*)", "m").test(msg?.text ?? "")) {
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

    } else if (new RegExp("#?枫酱超市$", "m").test(msg?.text ?? "")) {
        Bot.logger.info("收到指令：" + msg.text)
        event.group.sendMsg({ type: 'image', file: `base64://${await HtmlImg("shop", goods(event.sender.user_id, Bot))}` })
    } else if (new RegExp("#?个人仓库$", "m").test(msg?.text ?? "")) {
        Bot.logger.info("收到指令：" + msg.text)
        event.group.sendMsg({ type: 'image', file: `base64://${await HtmlImg("shop", userinfo(event.sender.user_id), event.sender.user_id)}` })
    } else if (new RegExp("#?购买道具(.*)$", "m").test(msg?.text ?? "")) {
        Bot.logger.info("收到指令：" + msg.text)
        let goodsid = msg.text.split("具")[1]
        await event.group.sendMsg(buyshop(event.sender.user_id, Number(goodsid)))
        event.group.sendMsg({ type: 'image', file: `base64://${await HtmlImg("shop", userinfo(event.sender.user_id), event.sender.user_id)}` })

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
// 私聊道具食用
function userpropsf(event: PrivateMessageEvent, Bot: Client) {
    let msgT = event.message.find(msg => msg.type === 'text') as TextElem
}
// 群聊道具食用
async function userpropsg(event: GroupMessageEvent, Bot: Client) {
    let msgT = event.message.find(msg => msg.type === 'text') as TextElem
    if (new RegExp("#?使用道具(.*)", "m").test(msgT?.text ?? "")) {
        //取右边的内容
        let prop = Number(msgT.text.split("道具")[1])
        let config = (groupc.get(event.group_id) ?? groupc.get(1)) as groupT
        if (config.props.find(item => item === prop)) {
            event.group.sendMsg("本群禁止使用该道具")
            return
        }
        if (!prop) {
            event.group.sendMsg("道具编号错误！")
            return;
        }
        let used = userprops(event.sender.user_id, prop)
        if (used != -1) {
            await event.group.sendMsg(`已经使用道具${(used as propT)?.name ?? ""}`)
            await event.group.sendMsg({ type: 'image', file: `base64://${await HtmlImg("shop", userinfo(event.sender.user_id), event.sender.user_id)}` })
            if ((used as propT).type === "jy") {
                let msgAt = event.message.find(msg => msg.type === 'at') as AtElem
                event.group.pickMember(msgAt.qq as number).mute(Number((used as propT).effect) ?? 180)
            }
            if ((used as propT).type === "cdk") {
                let cdkid = ((used as propT).effect as number)
                let cdk = await uedcdk(cdkid)
                if (cdk === -1) {
                    addprops(event.sender.user_id, prop);
                    event.group.sendMsg("该CDK已经被使用")

                } else {
                    //是否是好友
                    if (!Bot.getFriendList().get(event.sender.user_id)) {
                        addprops(event.sender.user_id, prop);
                        event.group.sendMsg("不是好友无法使用！")
                    }
                    Bot.sendPrivateMsg(event.sender.user_id, `您的CDK是${cdk}`)
                }
            }
        } else {
            await event.group.sendMsg("道具不存在或者无库存！")
        }
    }
}

export { friend, group };