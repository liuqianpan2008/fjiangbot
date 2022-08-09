import { Client, PrivateMessageEvent, Sendable, TextElem } from "oicq";

async function friend(event: PrivateMessageEvent, Bot: Client) {
    let cmd = await event.message.find(msg => msg.type === 'text') as TextElem
    await friendcmd(event, cmd.text, Bot, "#?帮助$", "帮助指令正在实装中。。。")
}
function friendcmd(event: PrivateMessageEvent, msg: string, Bot: Client, cod: string, message: Sendable) {
    let cmd: RegExp = new RegExp(cod, "m");
    if (cmd.test(msg)) {
        Bot.logger.info("收到指令：" + msg)
        Bot.sendPrivateMsg(event.sender.user_id, message)
    }
}
export { friend };