import { User } from "bilicaptain";
import { UserInfoFromSearch } from "bilicaptain/lib/types/user";
import { Client, Forwardable, segment, Sendable } from "oicq";
import { readBiliCredential } from "./login";
import http from "https";
async function UserInfo(qq: number) {
    let Bilidata = readBiliCredential(qq)
    if (Bilidata) {
        try {
            let user = new User(Bilidata)
            let info = await user.myInfo()
            return {
                name: info.name,
                Avatar: info.face,
                Gold: info.coins,
                msg: info.sign,
                day: "lv" + info.level,
            }
        } catch (error: any) {
            return error.message;
        }
    } else {
        return -1
    }
}
//搜索用户
async function SearchUser(name: string, Bot: Client): Promise<Sendable> {
    try {
        let info: UserInfoFromSearch[] = await User.searchUser(name)
        //截取前10个
        info = info.slice(0, 5)
        let fake: Forwardable[] = []
        for (let i = 0; i < info.length; i++) {
            let mags: Sendable = [
                `${info[i].title}(${info[i].param})`, '\n',
                `签名：${info[i].sign}`, '\n',
                `B站等级${info[i].level}`, '\n',
                `认证：${info[i].official_verify?.desc ?? "无"}`, '\n',
                `最新视频：${info[i]?.av_items[0]?.title}`, '\n',
                `播放量：${info[i]?.av_items[0]?.play},弹幕数：${info[i]?.av_items[0]?.danmaku}`, '\n',
                `播放地址：https://www.bilibili.com/video/av${info[i]?.av_items[0]?.param}`, '\n',
            ]
            fake.push({ user_id: Bot.uin, message: mags })
        }
        //创建转发消息
        return await Bot.makeForwardMsg(fake)
    } catch (error: any) {
        return error.message;
    }
}
//关注
async function Follow(qq: number, id: number): Promise<Sendable> {
    let Bilidata = readBiliCredential(qq)
    if (Bilidata) {
        try {
            if (await User.exist(id) != -1) {
                let user = new User(Bilidata)
                return (await user.follow(1, 11, id)) ? `关注${(await User.batchInfos([id]))[0].uname}成功` : "关注失败"
            } else {
                return "该用户不存在"
            }
        } catch (error: any) {
            return error.message;
        }
    } else {
        return "请先使用 #登陆 功能，登陆B站"
    }
}
export { UserInfo, SearchUser, Follow };