import { Client, GroupMessageEvent, PrivateMessageEvent } from "oicq";
import { russianRouletteConfig } from "../../config/config";
import { addGold, getGold, reduceGold, } from "./sign";
let palying: Map<Number, Number[]> = new Map()
let palyGold: Map<number, number> = new Map()
function russianRoulette(event: PrivateMessageEvent | GroupMessageEvent, Bot: Client) {
    if (event.message_type === 'group') {
        if (getGold(event.sender.user_id) === "请先使用#签到指令") {
            event.reply("请先使用#签到指令初始化数据")
            return;
        } else {
            if ((getGold(event.sender.user_id) as Number) < russianRouletteConfig.BayGold) {
                event.reply(`您的奖金不足${russianRouletteConfig.BayGold}元,无法开启游戏`)
                return;
            } else {
                reduceGold(event.sender.user_id, russianRouletteConfig.BayGold)
            }
        }

        if (!palying?.get(event.sender.user_id)) {
            palying.set(event.sender.user_id, [0, 0, 0, 0, 0, 0])
            getGold1(event.sender.user_id, 0)
        }
        let bulletrandom = palying.get(event.sender.user_id) as Number[]
        console.log(bulletrandom);

        bulletrandom[random(0, 5)] = 1
        let index = random(0, 5)
        if (bulletrandom[index] === 1) {
            event.reply("您已死亡,将丢失所有奖金")
            palying?.delete(event.sender.user_id)
            palyGold?.delete(event.sender.user_id)
            event.group.muteMember(event.sender.user_id, russianRouletteConfig.Banned)
        } else {
            bulletrandom.splice(index, 1)
            if (bulletrandom.length === 1) {
                getGold1(event.sender.user_id, russianRouletteConfig.reward)
                gameover(event)
                return
            } else {
                let Gold = random(russianRouletteConfig.MinGold, russianRouletteConfig.MaxGold)
                getGold1(event.sender.user_id, Gold)
                event.reply(`获得奖金${Gold},累计奖金${palyGold.get(event.sender.user_id)}`)
            }

        }
    }

}
//生成随机数
function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
//游戏结束
function gameover(event: GroupMessageEvent | PrivateMessageEvent) {
    if (palying.get(event.sender.user_id) === undefined) {
        event.reply(`你未开启游戏`)
        return
    }
    addGold(event.sender.user_id, Number(palyGold?.get(event.sender.user_id) ?? 0))
    event.reply(`您成功存活了下来,累计获得奖金${palyGold.get(event.sender.user_id)}`)
    palying?.delete(event.sender.user_id)
    palyGold?.delete(event.sender.user_id)
}
//获得奖金
function getGold1(paly: number, Gold: number) {
    palyGold.set(paly, (palyGold?.get(paly) ?? 0) + Gold)
}
export { russianRoulette, gameover }