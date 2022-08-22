import { Client, PrivateMessageEvent } from "oicq";
import { rules } from "../plugin";
import { bilibililogin } from "./login";
import livesign from "./live";
import sanlian from "./video";
function bilibili(event: PrivateMessageEvent, Bot: Client) {
    // rules()
    event.message.forEach(msg => {
        if (msg.type === "text") {
            rules("#登陆", msg, async () => {
                event.reply(await bilibililogin(event.sender.user_id, event))
            })
            rules("#B签到", msg, async () => {
                let res = await livesign(event.sender.user_id)
                if (res) {
                    event.reply(res)
                }
            })
            rules("#三连", msg, async () => {
                //去文本右边
                let bv = msg.text.split(new RegExp("#三连"))[1]
                let res = await sanlian(event.sender.user_id, bv)
                if (res) {
                    event.reply(res)
                }
            })
        }
    })
}
export default bilibili;


