import { Platform } from "oicq";
import { LogLevel } from "oicq/lib/client";

type QQcT = {
    qq: number,
    password?: string,
    log: LogLevel,
    platform: Platform
}

let QQc: QQcT = {
    qq: 100,
    password: '',
    log: "info",
    platform: Platform.aPad
};
type groupT = {
    IsgroupWelcome: boolean,
    groupWelcomeinfo: String
}
let groupc: Map<number, groupT> = new Map([
    // 默认配置
    [1, {
        IsgroupWelcome: true,
        groupWelcomeinfo: "欢迎使用枫酱Bot-这个可以在config.ts中修改"
    }],
    // 单独配置
    [877894787, { IsgroupWelcome: true, groupWelcomeinfo: "这里是枫酱Bot群，欢迎你的加入" }],
]);


export { QQc, groupc };