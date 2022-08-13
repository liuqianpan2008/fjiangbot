import path from "path"
import { props } from "../../config/config"
import { isFileExist, signinfo, } from "./sign"
import fs from 'fs'
import { Client } from "oicq"
function goods(id: number, Bot: Client) {
    let gold: Number | string = 0
    if (isFileExist(`${path.resolve()}/src/data/signdata.json`)) {
        let data = JSON.parse(fs.readFileSync(`${path.resolve()}/src/data/signdata.json`, "utf-8").toString()) as unknown as Array<signinfo>
        gold = data.find(item => item.id === id)?.Gold ?? "请先使用#签到指令"
    }
    return {
        gold: gold,
        props: props,
        Avatar: `https://q1.qlogo.cn/g?b=qq&s=100&nk=${Bot.uin}`,
    }
}
export { goods }