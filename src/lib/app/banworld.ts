import { Client, GroupMessageEvent, TextElem } from "oicq";
import { groupc } from "../../config/config";

async function banwords(event: GroupMessageEvent, Bot: Client) {
    let mags = event.message;
    let msgT = (mags.find(msg => msg.type === 'text') as TextElem)?.text ?? "".trim();
    let config = [...groupc.get(event.group_id)?.banwords ?? [], ...groupc.get(1)?.banwords ?? []]
    config.forEach(async item => {
        if (new RegExp(item, "m").test(msgT)) {
            Bot.logger.info(`触发违禁词：${msgT},准备撤回！`)
            if (await event.group.recallMsg(event.seq, event.rand)) {
                event.reply("触发违禁词，已被撤回")
            } else {
                Bot.logger.info("触发违禁词，撤回失败")
            }
        }
    })
}
export default banwords