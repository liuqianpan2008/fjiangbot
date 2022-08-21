import { Platform } from "oicq";
import { LogLevel } from "oicq/lib/client";
import { type } from "os";

type QQcT = {
    qq: number,
    password?: string,
    log: LogLevel,
    platform: Platform,
    ffmpeg: string
}
// 类型“String”的参数不能赋给类型“string | number | RecurrenceRule | RecurrenceSpecDateRange | RecurrenceSpecObjLit | Date”的参数。

type groupT = {
    IsgroupCod: boolean,
    IsgroupCodTime: number,
    Iscurfew: boolean,
    curfewTime: string | number | Date,
    curfewEndTime: string | number | Date,
    Isadmin: boolean,
    props: Array<Number>,
    banwords: Array<string>,
}
type signT = {
    Issign: boolean,
    MaxGold: number,
    MinGold: number
}
type propT = {
    id: number,
    type: "jy" | "cj" | "cdk" | "plugin",
    name: string,
    price: number,
    effect: any
}
type cdksT = {
    id: number,
    cdk: Array<cdkT>
}
type cdkT = {
    cod: "未使用" | "已使用",
    cdk: string,
}
type russianRouletteT = {
    isopen: boolean,
    MaxGold: number,//每轮获取到最大金币
    MinGold: number,//每轮获取到最小金币
    reward: number,//最后胜利奖励金币数
    Banned: number,//死亡后禁言时长，单位秒
    BayGold: number,//参加一次转轮所需金币数
}
let QQc: QQcT = {
    qq: 161009029,
    password: '',
    log: "info",
    platform: Platform.aPad,
    ffmpeg: ""
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
        props: [],//禁止使用的道具
        banwords: ["违禁词测试"]//违禁词，支持正则！
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
        props: [],//禁止使用道具
        banwords: []//违禁词，支持正则会继承默认配置！
    }],
]);
let signc: signT = {
    Issign: true,//是否开启签到
    MaxGold: 10,//最大金币
    MinGold: 1//最小金币
}
let admins: Array<number> = [2180323481];//管理员QQ号
let russianRoulette: russianRouletteT = {
    isopen: true,//是否开启转轮
    MaxGold: 10,//每轮获取到最大金币
    MinGold: 1,//每轮获取到最小金币
    reward: 100,//最后胜利奖励金币数
    Banned: 60,//死亡后禁言时长，单位秒
    BayGold: 10,//参加一次转轮所需金币数
}
let props: Array<propT> = [{
    //道具图片在modular/shop/icon文件夹下命名规则：id.png
    id: 1,
    name: "禁言卡",
    type: "jy",
    price: 100,
    effect: 60//禁言时常
}, {
    id: 2,
    name: "绿钻cdk",
    type: "cdk",
    price: 1000,
    effect: 1
}, {
    id: 3,
    name: "抽奖卡",
    type: "cj",
    price: 1000,
    effect: [
        {
            type: "gold",
            value: 100,
            probability: 0
        }, {
            type: "props",
            value: 1,
            probability: 0
        }]
}, {
    id: 4,
    name: "自定义插件道具",
    type: "plugin",
    price: 1000,
    effect: 1
}]
export { QQc, groupc, signc, admins, props, propT, groupT, cdkT, cdksT, russianRoulette };