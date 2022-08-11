import { Platform } from "oicq";
import { LogLevel } from "oicq/lib/client";

type QQcT = {
    qq: number,
    password?: string,
    log: LogLevel,
    platform: Platform
}
// 类型“String”的参数不能赋给类型“string | number | RecurrenceRule | RecurrenceSpecDateRange | RecurrenceSpecObjLit | Date”的参数。

type groupT = {
    IsgroupWelcome: boolean,
    groupWelcomeinfo: String,
    Iscurfew: boolean,
    curfewTime: string | number | Date,
    curfewEndTime: string | number | Date,
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
        groupWelcomeinfo: "欢迎使用枫酱Bot-这个可以在config.ts中修改",
        Iscurfew: false,//是否开启宵禁
        //Cron表达式生成网址https://cron.qqe2.com
        curfewTime: "0 0 0 23 * ?",//宵禁开始时间 需要Cron表达式
        curfewEndTime: "0 0 0 7 * ?",//宵禁结束时间 需要Cron表达式
    }],
    // 单独配置
    [877894787, {
        IsgroupWelcome: true,
        groupWelcomeinfo: "这里是枫酱Bot群，欢迎你的加入",
        Iscurfew: true,//是否开启宵禁
        curfewTime: "0 0 22 ? * ? ",//宵禁开始时间
        curfewEndTime: "0 0 7 ? * ? ",//宵禁结束时间
    }],
]);
let signc: signT = {
    Issign: true,//是否开启签到
    MaxGold: 10,//最大金币
    MinGold: 1//最小金币
}

export { QQc, groupc, signc };