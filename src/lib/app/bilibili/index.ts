import { Client, PrivateMessageEvent } from "oicq";
import { rules } from "../plugin";
import { bilibililogin } from "./login";
function bilibili(event: PrivateMessageEvent, Bot: Client) {
    event.message.forEach(msg => {
        if (msg.type === "text") {
            rules("#?登陆", msg, async () => {
                event.reply(await bilibililogin(event.sender.user_id, event))
            })
        }
    })
}
export default bilibili;


