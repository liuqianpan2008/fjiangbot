import path from "path"
import { props } from "../../config/config"
import { getGold, isFileExist, reduceGold, signinfo, } from "./sign"
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
                let data = props.find(item1 => item1.id === item.id)
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
function buyshop(userid: number, goodsid: number) {
    let msg = ''
    if (!props.find(item => item.id === goodsid)) {
        return "该道具不存在"
    }
    if (typeof getGold(userid) === 'number' && (getGold(userid) as number) < (props.find(item => item.id === goodsid)?.price ?? 0 as number)) {
        msg = `🎊金币不足，无法购买`
    } else {
        reduceGold(userid, props.find(item => item.id === goodsid)?.price ?? 0 as number)
        let data = JSON.parse(fs.readFileSync(`${path.resolve()}/src/data/userdata.json`, "utf-8").toString()) as unknown as Array<userinfo>
        let userinfoi = data.findIndex(item => item.id === userid)
        if (userinfoi === -1) {
            data.push({
                id: userid,
                props: [{
                    id: goodsid,
                    num: 1
                }]
            })
        } else {
            let propsi = data[userinfoi].props.findIndex(item => item.id === goodsid)
            if (propsi === -1) {
                data[userinfoi].props.push({
                    id: goodsid,
                    num: 1
                })
            } else {
                data[userinfoi].props[propsi].num = (data[userinfoi].props[propsi].num as number) + 1
            }
        }
        fs.writeFileSync(`${path.resolve()}/src/data/userdata.json`, JSON.stringify(data))
        msg = `🎊购买成功，获得${props.find(item => item.id === goodsid)?.name ?? ""}`
    }
    return msg
}

function userprops(user_id: number, goods_id: number) {
    let data = JSON.parse(fs.readFileSync(`${path.resolve()}/src/data/userdata.json`, "utf-8").toString()) as unknown as Array<userinfo>
    let userinfoi = data.findIndex(item => item.id === user_id)
    if (userinfoi === -1) {
        return -1
    } else {
        let propsi = data[userinfoi].props.findIndex(item => item.id === goods_id)
        if (propsi === -1 && (data[userinfoi].props.find(item => item.id === goods_id)?.num ?? -1) > 0) {
            return -1
        } else {
            if ((data[userinfoi].props[propsi]?.num ?? -1) > 0) {
                data[userinfoi].props[propsi].num = (data[userinfoi].props[propsi].num as number) - 1
            } else {
                return -1
            }
            fs.writeFileSync(`${path.resolve()}/src/data/userdata.json`, JSON.stringify(data))
            return {
                ...props.find(item => item.id === goods_id)
            }
        }
    }
}

export { goods, userinfo, buyshop, userprops }