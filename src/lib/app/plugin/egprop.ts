//导入依赖
import { GroupMessageEvent, PrivateMessageEvent } from "oicq";

function egprop(event: PrivateMessageEvent | GroupMessageEvent): void {
    event.reply("这是一个自定义道具使用")
}
export default egprop