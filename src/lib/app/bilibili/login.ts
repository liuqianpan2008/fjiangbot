import { Login, BiliCredential } from 'bilicaptain'
import fs from 'fs'
import { PrivateMessageEvent, segment, Sendable } from 'oicq'
import path from 'path'
import { HtmlImg } from '../../puppeteer'
import { UserInfo } from './user'
type bilibilidata = {
    qq: number,
    bilibili: BiliCredential
}
async function bilibililogin(id: number, event: PrivateMessageEvent): Promise<Sendable> {
    let data: bilibilidata[] = []

    if (checkFile(`${path.resolve()}/src/data/bilibili.json`)) {
        data = (readFile(`${path.resolve()}/src/data/bilibili.json`) as unknown as bilibilidata[]) ?? []
    } else {
        data = []
    }

    if (data.find(item => item.qq === id)) {
        return "你已经登陆过了"
    }
    let logo = await Login.loginQR('buffer', async (BiliCredential) => {
        data.push({
            qq: id,
            bilibili: BiliCredential
        })
        writeFile(`${path.resolve()}/src/data/bilibili.json`, data)
        event.reply("登录成功！(自动关注作者B站)")
        event.reply({ type: 'image', file: `base64://${await HtmlImg("sign", await UserInfo(event.sender.user_id), event.sender.user_id)}` })
    }) as Buffer
    event.reply("请不要扫描不信任的机器人的二维码！")
    return segment.image(logo)
}
//读取文件
function readFile(filePath: string) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}
// 写入文件
function writeFile(filePath: string, data: bilibilidata[]) {
    return fs.writeFileSync(filePath, JSON.stringify(data))
}
//读取BiliCredential
function readBiliCredential(qq: number) {
    let data = (readFile(`${path.resolve()}/src/data/bilibili.json`) as unknown as bilibilidata[]) ?? []
    return data.find(item => item.qq === qq)?.bilibili ?? null
}
//检查文件是否存在
function checkFile(filePath: string) {
    return fs.existsSync(filePath)
}


export { bilibililogin, readBiliCredential, bilibilidata } 