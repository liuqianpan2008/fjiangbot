import { Client, MemberIncreaseEvent } from "oicq";
import { groupc } from "../../config/config";
import { HtmlImg } from "../puppeteer";
import schedule from 'node-schedule';
type friendcod = {
    id: number,
    cod: String
}
let groupFriends: Map<number, Array<friendcod>> = new Map()
async function groupCod(event: MemberIncreaseEvent, bot: Client,) {
    bot.logger.info(`群${event.group_id}检测到，有新人入群！`)
    if (groupc.get(event.group_id)?.IsgroupCod ?? groupc.get(1)?.IsgroupCod ?? false) {
        bot.logger.info(`群${event.group_id}已经打开了验证功能！准备发送验证卡片`)
        if (groupFriends.get(event.group_id)) {
            let friends = groupFriends.get(event.group_id)
            friends?.push({
                id: event.user_id,
                cod: randomString(4)
            })
        } else {
            groupFriends.set(event.group_id, [{
                id: event.user_id,
                cod: randomString(4)
            }])
        }
        event.group.sendMsg({
            type: "image",
            file: `base64://${await HtmlImg('groupCod', await addGroupFriendsInfo(event, groupFriends.get(event.group_id)?.find(item => item.id === event.user_id)?.cod as string ?? "获取失败"), event.user_id)} `
        })
        //
        schedule.scheduleJob(new Date(new Date().getTime() + (groupc.get(event.group_id)?.IsgroupCodTime as number)), async () => {
            if (groupFriends.get(event.group_id) != null) {
                if (groupFriends.get(event.group_id)?.find(item => { if (item) { return item.id === event.user_id } else { false } })) {
                    bot.logger.info(`用户(${event.user_id})在群（${event.group_id}）验证超时超时准备T`)
                    event.group.pickMember(event.user_id).kick(true)
                    event.group.sendMsg(`用户${event.user_id}验证超时，被T了`)
                    groupFriends.get(event.group_id)?.find(item => item.id === event.user_id)
                }

            }
        })

    }
    async function addGroupFriendsInfo(event: MemberIncreaseEvent, content: string) {
        return {
            name: event.nickname,
            Avatar: `https://q1.qlogo.cn/g?b=qq&s=100&nk=${event.user_id}`,
            content: content
        }
    }
}
//随机字符串
function randomString(len: number) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
//延迟函数

export { groupCod, groupFriends }

