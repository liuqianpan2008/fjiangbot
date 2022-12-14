import path from "path"
import fs from "fs"
import { signc } from "../../config/config"
type signinfo = {
    name: string,
    id: Number,
    Gold: Number,
    day: Number,
    time: Number
}
async function sign(id: Number, name: string) {
    let data: Array<signinfo> = []
    let msg = ""
    let gold = random(signc.MinGold, signc.MaxGold)
    if (isFileExist(`${path.resolve()}/src/data/signdata.json`)) {
        data = JSON.parse(fs.readFileSync(`${path.resolve()}/src/data/signdata.json`, "utf-8").toString()) as unknown as Array<signinfo>
        let signinfoi = data.findIndex(item => item.id === id)
        if (signinfoi === -1) {
            data.push({
                name: name,
                id: id,
                Gold: gold,
                day: 1,
                time: new Date().getTime()
            })
            msg = `🎊签到成功，获得${gold}金币`
        } else {
            if (new Date().getTime() - (data[signinfoi].time as number) <= 1000 * 60 * 60 * 24) {
                msg = `今天已经签到过了,下面将展示签到信息`
            } else {
                data[signinfoi].Gold = (data[signinfoi].Gold as number) + gold
                data[signinfoi].day = (data[signinfoi].day as number) + 1
                data[signinfoi].time = new Date().getTime()
                msg = `🎊签到成功，获得${gold}金币`
            }
        }
    } else {
        data.push({
            name: name,
            id: id,
            Gold: gold,
            day: 1,
            time: new Date().getTime()
        })
        msg = `🎊签到成功，获得${gold}金币`
    }
    fs.writeFileSync(`${path.resolve()}/src/data/signdata.json`, JSON.stringify(data))
    return ({
        msg: msg,
        name: name,
        Avatar: `https://q1.qlogo.cn/g?b=qq&s=100&nk=${id}`,
        Gold: data.find(item => item.id === id)?.Gold ?? 0,
        day: data.find(item => item.id === id)?.day ?? 0
    })
}
//取随机整数
function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
//判断文件是否存在
function isFileExist(filePath: string) {
    return fs.existsSync(filePath)
}
//获取金币
function getGold(id: number) {
    let gold: Number | string = 0
    if (isFileExist(`${path.resolve()}/src/data/signdata.json`)) {
        let data = JSON.parse(fs.readFileSync(`${path.resolve()}/src/data/signdata.json`, "utf-8").toString()) as unknown as Array<signinfo>
        gold = data.find(item => item.id == id)?.Gold ?? "请先使用#签到指令"
    }
    return gold
}
//减去金币
function reduceGold(id: number, gold: number) {
    if (getGold(id) === "请先使用#签到指令") {
        return false
    } else {
        let data = JSON.parse(fs.readFileSync(`${path.resolve()}/src/data/signdata.json`, "utf-8").toString()) as unknown as Array<signinfo>
        let signinfoi = data.findIndex(item => item.id === id)
        data[signinfoi].Gold = (data[signinfoi].Gold as number) - gold
        fs.writeFileSync(`${path.resolve()}/src/data/signdata.json`, JSON.stringify(data))
        return true
    }
}
//增加金币
function addGold(id: number, gold: number) {
    if (getGold(id) === "请先使用#签到指令") {
        return false
    } else {
        let data = JSON.parse(fs.readFileSync(`${path.resolve()}/src/data/signdata.json`, "utf-8").toString()) as unknown as Array<signinfo>
        let signinfoi = data.findIndex(item => item.id === id)
        data[signinfoi].Gold = (data[signinfoi].Gold as number) + gold
        fs.writeFileSync(`${path.resolve()}/src/data/signdata.json`, JSON.stringify(data))
        return true
    }
}
export { sign, isFileExist, signinfo, getGold, reduceGold, addGold }