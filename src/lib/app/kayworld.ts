import { GroupMessageEvent, MessageElem, PrivateMessageEvent, TextElem, } from "oicq";
import fs from "fs"
import path from "path";

let keyworlds: { id: number, group: number, key: MessageElem[], world: MessageElem[] }[] = []
async function addkay(mags: MessageElem[], event: PrivateMessageEvent | GroupMessageEvent) {
    let con = mags.find(msg => msg.type == "text") as TextElem
    let keywords: MessageElem[] = []
    //添加关键词
    if (new RegExp("#?关键词(.*)").test(con?.text ?? "")) {
        let key = con.text.split(new RegExp("#?关键词(.*)"))[1]
        let [, ...keys] = mags
        if (key) {
            keywords?.push({ type: "text", text: key }, ...keys)
        } else {
            keywords?.push(...keys)
        }
        if (keywords.find(item => item.type === "image")) {
            event.reply("关键词内不可以包括图片")
            return
        }
        if (keyworlds?.findIndex(item => item.id === event.sender.user_id) > -1) {
            event.reply("你添加了关键词，请回复")
            return
        }
        await readkay()
        if (event.message_type === 'group') {
            keyworlds?.unshift({
                id: event.sender.user_id,
                group: event.group_id,
                key: keywords,
                world: []
            })
        } else {
            keyworlds?.unshift({
                id: event.sender.user_id,
                group: 0,
                key: keywords,
                world: []
            })
        }
        event.reply("请输入回复内容")
        setTimeout(() => {
            console.log("超时");
            if (keyworlds?.findIndex(item => item.id === event.sender.user_id) > -1) {
                let index = keyworlds?.findIndex(item => item.id === event.sender.user_id)
                delete keyworlds[index]
                event.reply("添加超时")
            }
        }, 15000)
        return;
    }
    //添加回复
    if (keyworlds?.findIndex(item => item?.id === event?.sender?.user_id) > -1) {
        let index = keyworlds?.findIndex(item => item.id === event.sender.user_id)
        keyworlds[index].world = mags
        keyworlds[index].id = 0
        event.reply("添加成功！")
        writekay()
        return;
    }
    //五秒后触发

    //触发关键词
    try {
        await readkay()
        for (let item of keyworlds) {
            if (event.message_type == "group" && item.group === event.group_id && JSON.stringify(item.key) === JSON.stringify(mags)) {
                event.reply(item.world)
                return
            }
            if (event.message_type == "private" && JSON.stringify(item.key) === JSON.stringify(mags)) {
                event.reply(item.world)
                return;
            }
        }
    } catch (error) {
        console.log(error)
    }
}
// 读取关键词
async function readkay() {
    // 判断文件是否存在
    if (fs.existsSync(`${path.resolve()}/src/data/worlds.json`)) {
        let data = fs.readFileSync(`${path.resolve()}/src/data/worlds.json`, "utf8")
        keyworlds = JSON.parse(data)
    } else {
        keyworlds = []
    }
}
// 写入关键词
async function writekay() {
    fs.writeFileSync(`${path.resolve()}/src/data/worlds.json`, JSON.stringify(keyworlds, null, 1), "utf8")
}
export default addkay