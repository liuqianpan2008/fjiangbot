import { Client, MemberIncreaseEvent } from "oicq";
import { groupc } from "../../config/config";
import { HtmlImg } from "../puppeteer";

async function groupWelcome(event: MemberIncreaseEvent, bot: Client,) {
    bot.logger.info(`群${event.group_id}检测到，有新人入群！`)
    if (groupc.get(event.group_id)?.IsgroupWelcome ?? groupc.get(1)?.IsgroupWelcome ?? false) {
        bot.logger.info(`群${event.group_id}已经打开了欢迎功能！准备发送欢迎卡片`)
        let info = groupc.get(event.group_id)?.groupWelcomeinfo ?? groupc.get(1)?.groupWelcomeinfo ?? ""
        event.group.sendMsg({
            type: "image",
            file: `base64://${await HtmlImg("groupWelcome", await addGroupFriendsInfo(event, info as string))}`
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
export { groupWelcome }