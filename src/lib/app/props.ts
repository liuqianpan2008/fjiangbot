import fs from 'fs'
import { Client, GroupMessageEvent, PrivateMessageEvent, TextElem } from 'oicq'
import path from 'path'
import { cdksT, propT } from '../../config/config'
import { HtmlImg } from '../puppeteer'
import { addprops, userinfo, userprops } from './shop'
import { addGold } from './sign'
async function uedcdk(id: number) {
    let data = JSON.parse(fs.readFileSync(`${path.resolve()}/src/config/cdk.json`, "utf-8").toString()) as unknown as Array<cdksT>
    let cdks = data.find(item => item.id === id) as cdksT
    let cdksi = data.findIndex(item => item.id === id)
    let cdki = cdks?.cdk?.findIndex(item => item.cod === '未使用')
    if (cdki === -1) {
        return -1
    }
    data[cdksi].cdk[cdki].cod = '已使用'
    fs.writeFileSync(`${path.resolve()}/src/config/cdk.json`, JSON.stringify(data, null, 1))
    return data[cdksi].cdk[cdki].cdk

}
//抽奖
type lotteryT = {
    type: "gold" | "props",
    value: number,
    probability: number

}
async function lottery(lottery: Array<lotteryT>, user_id: number) {
    let goods: lotteryT[] = []
    lottery.forEach(item => {
        if (random(0, item.probability) === 0) {
            goods.push(item)
        }
    })
    let res = ""
    goods.forEach(item => {
        if (item.type === "props") {
            let prop = addprops(user_id, item.value);
            res += `🎊获得${(prop as propT).name}\n`
        }
        if (item.type === "gold") {
            res += `🎊获得${item.value}金币\n`
            addGold(user_id, item.value)
        }
    })
    if (res === "") {
        res = "🎊什么都没抽到"
    }
    return res
}
async function userprop(event: PrivateMessageEvent | GroupMessageEvent, Bot: Client) {
    let msgT = event.message.find(msg => msg.type === 'text') as TextElem
    if (new RegExp("#?使用道具(.*)", "m").test(msgT?.text ?? "")) {
        //取右边的内容
        let prop = Number(msgT.text.split("道具")[1])
        if (!prop) {
            event.reply("道具编号错误！")
            return;
        }
        let used = userprops(event.sender.user_id, prop)
        if (used != -1) {
            await event.reply(`已经使用道具${(used as propT)?.name ?? ""}`)
            await event.reply({ type: 'image', file: `base64://${await HtmlImg("shop", userinfo(event.sender.user_id), event.sender.user_id)}` })
            if ((used as propT).type === "cdk") {
                let cdkid = ((used as propT).effect as number)
                let cdk = await uedcdk(cdkid)
                if (cdk === -1) {
                    addprops(event.sender.user_id, prop);
                    event.reply("该CDK已经被使用")
                } else {
                    //是否是好友
                    if (!Bot.getFriendList().get(event.sender.user_id)) {
                        addprops(event.sender.user_id, prop);
                        event.reply("不是好友无法使用！")
                    }
                    Bot.sendPrivateMsg(event.sender.user_id, `您的CDK是${cdk}`)
                }
            }
            if ((used as propT).type === "cj") {
                let lotterys = await lottery((used as propT).effect as Array<lotteryT>, event.sender.user_id)
                event.reply(lotterys)
            }
        } else {
            await event.reply("道具不存在或者无库存！")
        }
    }
}
// 抽取一个随机数
function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
export { uedcdk, lottery, lotteryT, userprop }