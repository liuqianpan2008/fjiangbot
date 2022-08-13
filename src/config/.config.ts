import { Platform } from "oicq";
import { LogLevel } from "oicq/lib/client";
import { type } from "os";

type QQcT = {
    qq: number,
    password?: string,
    log: LogLevel,
    platform: Platform
}
// 类型“String”的参数不能赋给类型“string | number | RecurrenceRule | RecurrenceSpecDateRange | RecurrenceSpecObjLit | Date”的参数。

type groupT = {
    IsgroupCod: boolean,
    IsgroupCodTime: number,
    Iscurfew: boolean,
    curfewTime: string | number | Date,
    curfewEndTime: string | number | Date,
    Isadmin: boolean,
    props: Array<propT>,
}
type signT = {
    Issign: boolean,
    MaxGold: number,
    MinGold: number
}
type propT = {
    id: number,
    name: string,
    price: number,
    effect: any
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
        IsgroupCod: true,//是否开启进群验证码
        IsgroupCodTime: 10000,//单位秒
        Iscurfew: false,//是否开启宵禁
        //Cron表达式生成网址：https://cron.qqe2.com
        curfewTime: "0 0 22 ? * ? ?",//宵禁开始时间 需要Cron表达式
        curfewEndTime: "0 0 7 ? * ? ",//宵禁结束时间 需要Cron表达式
        Isadmin: true,//是否管理员使用群管功能
        props: []//禁用道具
    }],
    // 单独配置
    [877894787, {
        IsgroupCod: true,//是否开启进群验证码
        IsgroupCodTime: 60000,//单位毫秒
        Iscurfew: false,//是否开启宵禁
        // 尽量不要设置同一时间段否则容易🐔
        curfewTime: "0 0 22 ? * ? ?",//宵禁开始时间
        curfewEndTime: "0 0 7 ? * ? ",//宵禁结束时间
        Isadmin: true,
        props: []//禁用道具
    }],
]);
let signc: signT = {
    Issign: true,//是否开启签到
    MaxGold: 10,//最大金币
    MinGold: 1//最小金币
}
let admins: Array<number> = [2180323481];//管理员QQ号
let props: Array<propT> = [{
    id: 1,//⚠️切勿随意更改⚠️
    name: "禁言卡",
    price: 100,
    effect: 60//禁言时常
}, {
    id: 2,//⚠️切勿随意更改⚠️
    name: "补签卡",
    price: 100,
    effect: ""//
}, {
    id: 3,//⚠️切勿随意更改⚠️
    name: "枫叶群专属兑换卡",
    price: 1000,
    effect: ["123456", "123456"]

}]
export { QQc, groupc, signc, admins, props, };