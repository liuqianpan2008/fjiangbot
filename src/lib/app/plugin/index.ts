import { GroupMessageEvent, PrivateMessageEvent, Sendable, TextElem } from "oicq"
import egPlugin from "./eg"

async function runplugin(event: PrivateMessageEvent | GroupMessageEvent, smg: TextElem) {
    //写好插件要在这里进行指令注册
    //@param rule 正则匹配插件的指令
    //@param run 自己写的函数调用
    pluginrule("#例子", egPlugin())

    //下面不要动
    function pluginrule(rule: string, run: Sendable) {
        rules(rule, smg, async () => {
            event.reply(run)
        })
    }
}

async function rules(rules: string, msg: TextElem, run: Function) {
    if (new RegExp(rules).test(msg.text)) {
        await run()
        return true
    } else {
        return false
    }
}
export { rules, runplugin }