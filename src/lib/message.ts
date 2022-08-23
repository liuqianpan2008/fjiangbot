import axios from "axios";
import { AtElem, Client, GroupMessageEvent, PrivateMessageEvent, segment, TextElem } from "oicq";
import path from "path";
import { admins, groupc, russianRouletteConfig, signc } from "../config/config";
import { Aivoice } from "./app/Aivoice";
import banwords from "./app/banworld";
import bilibili from "./app/bilibili";
import livesign from "./app/bilibili/live";
import { Follow, SearchUser, UserInfo } from "./app/bilibili/user";
import { operationVideo, sanlian, Videoinfo } from "./app/bilibili/video";
import { groupFriends } from "./app/groupcod";
import groupinfo from "./app/groupinfo";
import { githelpData } from "./app/help/help";
import addwrold from "./app/kayworld";
import { rules, runplugin } from "./app/plugin";
import { userprop } from "./app/props";
import { gameover, russianRoulette } from "./app/russianRoulette";
import { buyshop, goods, userinfo } from "./app/shop";
import { addGold, getGold, sign } from "./app/sign";
import { HtmlImg } from "./puppeteer";
import rankinglist from "./rankingList";
async function message(event: PrivateMessageEvent | GroupMessageEvent, Bot: Client) {
    let msg = event.message
    msg.forEach(async (item) => {
        switch (item.type) {
            case "text": (async () => {
                rules("#?帮助$", item, async () => {
                    event.reply({ type: 'image', file: `base64://${await HtmlImg("help", await githelpData(Bot))}` })
                })
                rules("^#?签到$", item, async () => {
                    if (signc.Issign) {
                        event.reply({ type: 'image', file: `base64://${await HtmlImg("sign", await sign(event.sender.user_id, event.nickname), event.sender.user_id)}` })
                    }
                })
                rules("^#?枫酱超市$", item, async () => {
                    event.reply({ type: 'image', file: `base64://${await HtmlImg("shop", goods(event.sender.user_id, Bot), event.sender.user_id)}` })
                })
                rules("^#?个人仓库$", item, async () => {
                    event.reply({ type: 'image', file: `base64://${await HtmlImg("shop", userinfo(event.sender.user_id), event.sender.user_id)}` })
                })
                rules("^#?购买道具(.*)$", item, async () => {
                    let goodsid = item.text.split("具")[1].trim()
                    await event.reply(buyshop(event.sender.user_id, Number(goodsid)))
                    event.reply({ type: 'image', file: `base64://${await HtmlImg("shop", userinfo(event.sender.user_id), event.sender.user_id)}` })
                })
                rules("^#?点歌(.*)", item, async () => {
                    let song = item.text.split("歌")[1]
                    console.log(song);
                    let date = await (await axios.get(`https://cloud-music-api-f494k233x-mgod-monkey.vercel.app/search?keywords=${encodeURI(song)}`)).data
                    if (event.message_type === 'group') {
                        event.reply("点歌成功!歌曲名称：" + date.result.songs[0].name)
                        event.group.shareMusic("163", date.result.songs[0].id)
                    }
                })
                rules("#?一言", item, async () => {
                    let date = await (await axios.get(`http://api.guaqb.cn/v1/onesaid/`)).data
                    if (event.message_type === 'group') {
                        event.reply(date)
                    }
                })
                rules("#?个人信息", item, async () => {
                    if (event.message_type === 'group') {
                        event.reply({ type: 'image', file: `base64://${await HtmlImg("grupinfo", await groupinfo(event.member), event.sender.user_id)}` })
                    }
                })
                rules("#?榜单", item, async () => {
                    event.reply({ type: 'image', file: `base64://${await HtmlImg("rankingList", await rankinglist(event), event.sender.user_id)}` })
                })
                rules("#?说(.*)", item, async () => {
                    let data = item.text.split(new RegExp("#?说(.*)"))[1]
                    if (data.indexOf("|") === -1) {
                        return
                    }
                    let playtext = data.split("|")
                    if (playtext.length === 2) {

                        if (Aivoice(playtext[0], playtext[1]) === -1) {
                            event.reply("不支持本角色语音")
                        } else {
                            event.reply("接受指令成功!正在生成中....")
                            event.reply({
                                type: "record",
                                file: Aivoice(playtext[0], playtext[1]) as string,
                            }).catch(err => console.log(err))
                        }
                    } else {
                        event.reply("参数错误")
                    }
                })
                if (russianRouletteConfig.isopen) {
                    rules("#?俄罗斯转盘$", item, async () => {
                        russianRoulette(event, Bot)
                    })
                    rules("#?结束转盘$", item, async () => {
                        gameover(event)
                    })
                }
                rules("#?疯狂星期四", item, async () => {
                    event.reply('收到指令，准备发送！')
                    event.reply(segment.video(`${path.resolve()}/src/modular/video/v50.mp4`)).catch(err => console.log(err))
                })
                rules("^#查询(.*)$", item, async () => {
                    //去文本右边
                    let bv = item.text.split(new RegExp("#查询"))[1]
                    console.log(bv);
                    let res = await Videoinfo(event.sender.user_id, bv)
                    if (res) {
                        event.reply("开始查询请稍等！")
                        event.reply(res).then(res => { }).catch(err => {
                            Bot.logger.debug(err)
                        }).then(res => {
                            event.reply("查询完成!,回复 #同意三连 可以快速给视频三连")
                        })
                    }
                })
                rules("^#?三连(.*)$", item, async () => {
                    //去文本右边
                    let bv = item.text.split(new RegExp("#?三连"))[1]
                    let res = await sanlian(event.sender.user_id, bv)
                    if (res) {
                        event.reply(res).then(res => { }).catch(err => {
                            console.log(err)
                        })
                    }
                })
                rules("^#?B签到$", item, async () => {
                    let res = await livesign(event.sender.user_id)
                    if (res) {
                        event.reply(res)
                    }
                })
                rules("^#?B站信息$", item, async () => {
                    event.reply({ type: 'image', file: `base64://${await HtmlImg("sign", await UserInfo(event.sender.user_id), event.sender.user_id)}` })
                })
                rules("^#?搜索B站用户(.*)$", item, async () => {
                    event.reply("搜索中....")
                    event.reply(await SearchUser(item.text.split(new RegExp("^#?搜索B站用户(.*)$"))[1], Bot))
                })
                rules("^#?关注(.*)$", item, async () => {
                    event.reply(await Follow(event.sender.user_id, Number(item.text.split(new RegExp("^#?关注B站(.*)$"))[1])))
                })
                // rules("#?=\d(\\+|-|\\*|\\/)\d", item, async () => {
                //     let calculate = item.text.split(new RegExp(""))[1]
                //     console.log(calculate);
                //     try {
                //         let result = String(await eval(calculate))
                //         event.reply(`计算结果：` + result)
                //     } catch (error) {
                //         console.log(error);
                //     }
                // })

                runplugin(event, item);
            })()
        }
    })
    if (event.message_type === 'private') {
        bilibili(event, Bot)
    }
    operationVideo(event)
    addwrold(event.message, event)
    userprop(event, Bot);
}

async function group(event: GroupMessageEvent, Bot: Client) {
    groupValidation(event, Bot)
    groupAt(event, Bot)
    userprop(event, Bot);
    banwords(event, Bot);
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
    if (new RegExp("#?给钱$", "m").test(msgT?.text ?? "")) {
        Bot.logger.info("收到指令：给钱")
        if (msgAt && ((c?.Isadmin ? event.member.is_admin : true) || admins.find(item => { return item === event.member.uid }))) {
            let mags = event.message
            mags.splice(mags.findIndex(msg => msg.type === 'at'), 1)
            // 去除空格
            let Gold = Number((mags[1] as TextElem).text.trim())
            if (Gold === 0) {
                Gold = 0
            }
            if (addGold(msgAt.qq as number, Gold)) {
                await event.group.sendMsg(`已经对${msgAt.text}获得金币${Gold},他现在的金币为${getGold(msgAt.qq as number)}`)
            } else {
                await event.group.sendMsg(`请先使用签到初始化数据`)
            }
        } else {
            await event.group.sendMsg("条件不满足")
        }
    }
}
// 食用道具
export { group, message };