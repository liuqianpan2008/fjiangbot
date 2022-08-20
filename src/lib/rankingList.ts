import fs from "fs"
import { GroupMessageEvent, PrivateMessageEvent } from "oicq"
import path from "path"
import { signinfo } from "./app/sign"
async function rankinglist(event: PrivateMessageEvent | GroupMessageEvent) {
    let data = readSignData() as Array<signinfo>
    data.sort((a, b) => { return Number(b.Gold) - Number(a.Gold) })
    event.reply("正在全力生成中。。。请耐心等待！")
    if (data.length > 10) {
        data = data.slice(0, 10)
    }
    return {
        "data": data,
    }
}
// 读取签到数据
function readSignData() {
    if (isFileExist(`${path.resolve()}/src/data/signdata.json`)) {
        let data = fs.readFileSync(`${path.resolve()}/src/data/signdata.json`, "utf8")
        return JSON.parse(data)
    } else {
        return []
    }

}
// 判断文件是否存在
function isFileExist(filePath: string) {
    return fs.existsSync(filePath)
}

export default rankinglist;