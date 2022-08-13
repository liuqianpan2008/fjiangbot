import path from "path"
import { props } from "../../config/config"
import { getGold, isFileExist, signinfo, } from "./sign"
import fs from 'fs'
import { Client } from "oicq"
function goods(id: number, Bot: Client) {
    return {
        title: "枫叶超市",
        gold: getGold(id),
        props: props,
        Avatar: `https://q1.qlogo.cn/g?b=qq&s=100&nk=${Bot.uin}`,
    }
}
type userinfo = {
    id: number,
    props: Array<propsdata>
}
type propsdata = {
    id: number,
    num: number,
}
function userinfo(id: number) {
    let propdate: any[] = []
    if (isFileExist(`${path.resolve()}/src/data/userdata.json`)) {
        // json文件读取
        let data = JSON.parse(fs.readFileSync(`${path.resolve()}/src/data/userdata.json`, "utf-8").toString()) as unknown as Array<userinfo>
        if (data.find(item => item.id === id)) {
            data.find(item => item.id === id)?.props.forEach(item => {
                let data = props.find(item => item.id === item.id)
                propdate.push({
                    ...data,
                    num: item.num
                })
            })
        }

    } else {
        fs.writeFileSync(`${path.resolve()}/src/data/userdata.json`, JSON.stringify([]))
    }
    return {
        title: "个人仓库",
        gold: getGold(id),
        props: propdate,
        Avatar: `https://q1.qlogo.cn/g?b=qq&s=100&nk=${id}`,
    }
}
export { goods, userinfo }