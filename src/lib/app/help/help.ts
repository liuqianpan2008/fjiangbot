import { Client } from "oicq";
import { data } from "./data";

async function githelpData(Bot: Client) {

    return ({
        data: data,
        Avatar: `https://q1.qlogo.cn/g?b=qq&s=100&nk=${Bot.uin}`,
        BotName: Bot.nickname,
    })
}
export { githelpData };