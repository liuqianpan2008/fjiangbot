import { Platform } from "oicq";
import { LogLevel } from "oicq/lib/client";

type QQcT = {
    qq: number,
    password?: string,
    log: LogLevel,
    platform: Platform
}
type groupT = {
    IsgroupWelcome: boolean,
    groupWelcomeinfo: String
}
type signT = {
    Issign: boolean,
    MaxGold: number,
    MinGold: number
}
let QQc: QQcT = {
    qq: 161009029,
    password: '13393280310a',
    log: "info",
    platform: Platform.aPad
};
let groupc: Map<number, groupT> = new Map([
    // 默认配置
    [1, {
        IsgroupWelcome: true,
        groupWelcomeinfo: "欢迎使用枫酱Bot-这个可以在config.ts中修改"
    }],
    // 单独配置
    [877894787, { IsgroupWelcome: true, groupWelcomeinfo: "这里是枫酱Bot群，欢迎你的加入" }],
]);
let signc: signT = {
    Issign: true,//是否开启签到
    MaxGold: 10,//最大金币
    MinGold: 1 //最小金币
}

export { QQc, groupc, signc };