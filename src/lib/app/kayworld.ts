import { GroupMessageEvent, MessageElem, PrivateMessageEvent, TextElem, } from "oicq";
import fs from "fs"
import path from "path";

async function addkey(mags: MessageElem[], event: PrivateMessageEvent | GroupMessageEvent) {
    let con = mags.find(msg => msg.type == "text") as TextElem
    //添加关键词
    if (new RegExp("#?添加词条(.*)").test(con?.text ?? "")) {
        let keywords: MessageElem[] = []
        let key = con.text.split(new RegExp("#?添加词条(.*)"))[1]
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
        let worldkey: { id: number, group: number, key: MessageElem[], world: MessageElem[] }[] = await readkey()

        if (worldkey?.findIndex(item => item.id === event.sender.user_id) > -1) {
            event.reply("你添加了关键词，请回复")
            return
        }
        if (event.message_type === 'group') {
            worldkey?.unshift({
                id: event.sender.user_id,
                group: event.group_id,
                key: keywords,
                world: []
            })
        } else {
            worldkey?.unshift({
                id: event.sender.user_id,
                group: 0,
                key: keywords,
                world: []
            })
        }
        await writekey(worldkey)
        event.reply("请输入回复内容")
        setTimeout(async () => {
            let dalkeyworlds: { id: number, group: number, key: MessageElem[], world: MessageElem[] }[] = await readkey()
            for (let index = 0; index < dalkeyworlds.length; index++) {
                const element = dalkeyworlds[index];
                if (element.world.length === 0 && element.id === event.sender.user_id) {
                    dalkeyworlds.splice(index, 1)
                    await writekey(dalkeyworlds)
                    event.reply("添加超时")
                    return
                }
            }
        }, 9000)
        return;
    }
    // 删除关键词
    if (new RegExp("#?删除词条(.*)").test(con?.text ?? "")) {
        let key = con.text.split(new RegExp("#?删除词条(.*)"))[1]
        let [, ...keys] = mags
        let keywords: MessageElem[] = []
        if (key) {
            keywords?.push({ type: "text", text: key }, ...keys)
        } else {
            keywords?.push(...keys)
        }
        let worldkey: { id: number, group: number, key: MessageElem[], world: MessageElem[] }[] = await readkey()
        try {

            let index = worldkey.findIndex(item => JSON.stringify(item.key) === JSON.stringify(keywords))
            if (index > -1) {
                worldkey.splice(index, 1)
                console.log(worldkey);
                writekey(worldkey)
                event.reply("删除成功")
            } else {
                event.reply("没有找到该关键词")
            }


        } catch (e) {
            console.log(e);

        }


    }
    //查看关键词
    try {
        if (new RegExp("#?查看词条").test(con?.text ?? "")) {
            let worlds: { id: number, group: number, key: MessageElem[], world: MessageElem[] }[] = []
            if (fs.existsSync(`${path.resolve()}/src/data/worlds.json`)) {
                let data = fs.readFileSync(`${path.resolve()}/src/data/worlds.json`, "utf8")
                worlds = JSON.parse(data)
            } else {
                worlds = []
            }
            let ret: MessageElem[] = []
            if (worlds.length > 0) {
                if (event.message_type === "group") {
                    for (let index = 0; index < worlds?.length ?? 0; index++) {
                        const element = worlds[index];
                        if (element.group === (event as GroupMessageEvent).group_id) {
                            ret.push(...element?.key ?? "", { type: "text", text: "---" }, ...element?.world ?? ""), { type: "text", text: `|` }
                        }
                    }
                } else {
                    for (let index = 0; index < worlds?.length ?? 0; index++) {
                        const element = worlds[index];
                        if (element.group === 0) {
                            ret.push(...element?.key ?? "", { type: "text", text: "---" }, ...element?.world ?? ""), { type: "text", text: "\n" }
                        }
                    }
                }
            } else {
                ret.push({ type: "text", text: "暂无关键词" })
            }
            if (ret.length > 0) {
                event.reply(ret)
            } else {
                event.reply("暂无关键词")
            }

        }
    } catch (error) {
        console.log(error);
    }

    //添加回复
    let keyworlds: { id: number, group: number, key: MessageElem[], world: MessageElem[] }[] = await readkey()
    if (keyworlds?.findIndex(item => item?.id === event?.sender?.user_id) > -1) {
        let index = keyworlds?.findIndex(item => item.id === event.sender.user_id)
        keyworlds[index].world = mags
        keyworlds[index].id = 0
        event.reply("添加成功！")
        writekey(keyworlds)
        return;
    }
    //触发关键词
    try {
        let keyworlds: { id: number, group: number, key: MessageElem[], world: MessageElem[] }[] = await readkey()
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
async function readkey() {
    // 判断文件是否存在
    if (fs.existsSync(`${path.resolve()}/src/data/worlds.json`)) {
        let data = fs.readFileSync(`${path.resolve()}/src/data/worlds.json`, "utf8")
        return JSON.parse(data)
    } else {
        return []
    }
}
// 写入关键词
async function writekey(keyworlds: any) {
    fs.writeFileSync(`${path.resolve()}/src/data/worlds.json`, JSON.stringify(keyworlds, null, 1), "utf8")
}

export default addkey