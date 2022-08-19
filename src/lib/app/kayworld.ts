import { GroupMessageEvent, MessageElem, PrivateMessageEvent, TextElem, } from "oicq";
import fs from "fs"
import path from "path";

async function addkay(mags: MessageElem[], event: PrivateMessageEvent | GroupMessageEvent) {
    let con = mags.find(msg => msg.type == "text") as TextElem
    //添加关键词
    if (new RegExp("#?添加关键词(.*)").test(con?.text ?? "")) {
        let keywords: MessageElem[] = []
        let key = con.text.split(new RegExp("#?添加关键词(.*)"))[1]
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
        let keyworlds: { id: number, group: number, key: MessageElem[], world: MessageElem[] }[] = await readkay()

        if (keyworlds?.findIndex(item => item.id === event.sender.user_id) > -1) {
            event.reply("你添加了关键词，请回复")
            return
        }
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
        await writekay(keyworlds)
        setTimeout(async () => {
            console.log("超时");
            let dalkeyworlds: { id: number, group: number, key: MessageElem[], world: MessageElem[] }[] = await readkay()
            for (let index = 0; index < dalkeyworlds.length; index++) {
                const element = dalkeyworlds[index];
                if (element.world.length === 0 && element.id === event.sender.user_id) {
                    dalkeyworlds.splice(index, 1)
                    await writekay(dalkeyworlds)
                    event.reply("添加超时")
                    return
                }
            }
        }, 9000)
        return;
    }
    // 删除关键词
    if (new RegExp("#?删除关键词(.*)").test(con?.text ?? "")) {
        let key = con.text.split(new RegExp("#?删除关键词(.*)"))[1]
        let [, ...keys] = mags
        let keywords: MessageElem[] = []
        if (key) {
            keywords?.push({ type: "text", text: key }, ...keys)
        } else {
            keywords?.push(...keys)
        }
        let keyworlds = await readkay()
        try {
            for (let index = 0; index < keyworlds.length; index++) {
                const element = keyworlds[index].key;
                if (JSON.stringify(element) === JSON.stringify(keywords)) {
                    keywords.splice(index, 1)
                    writekay(keyworlds)
                    event.reply("删除成功")
                    return
                }
            }
        } catch (e) {
            console.log(e);

        }


    }
    //查看关键词
    try {
        if (new RegExp("#?查看关键词").test(con?.text ?? "")) {
            let worlds: { id: number, group: number, key: MessageElem[], world: MessageElem[] }[] = []
            if (fs.existsSync(`${path.resolve()}/src/data/worlds.json`)) {
                let data = fs.readFileSync(`${path.resolve()}/src/data/worlds.json`, "utf8")
                worlds = JSON.parse(data)
                // console.log(worlds);
            } else {
                worlds = []
            }
            let ret: MessageElem[] = []
            if (worlds.length > 0) {
                worlds.forEach(world => ret.push(...world?.key ?? "", { type: "text", text: "---" }, ...world?.world ?? ""), { type: "text", text: "\n" })
            } else {
                ret.push({ type: "text", text: "暂无关键词" })
            }
            event.reply(ret)
        }
    } catch (error) {
        console.log(error);
    }

    //添加回复
    let keyworlds: { id: number, group: number, key: MessageElem[], world: MessageElem[] }[] = await readkay()
    if (keyworlds?.findIndex(item => item?.id === event?.sender?.user_id) > -1) {
        let index = keyworlds?.findIndex(item => item.id === event.sender.user_id)
        keyworlds[index].world = mags
        keyworlds[index].id = 0
        event.reply("添加成功！")
        writekay(keyworlds)
        return;
    }
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
        return JSON.parse(data)
    } else {
        return []
    }
}
// 写入关键词
async function writekay(keyworlds: any) {
    fs.writeFileSync(`${path.resolve()}/src/data/worlds.json`, JSON.stringify(keyworlds, null, 1), "utf8")
}

export default addkay