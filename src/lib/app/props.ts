import fs from 'fs'
import path from 'path'
import { cdksT, props, propT } from '../../config/config'
import { addprops } from './shop'
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
// 抽取一个随机数
function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
export { uedcdk, lottery, lotteryT }