import path from "path";

type dataT = {
    name: string,
    describe: string,
    icon: string,
}
let urlicon = `${path.resolve()}/src/lib/app/help/icon/`
let data: Array<dataT> = [
    {
        "name": "#签到",
        "describe": "获取金币的好法子！",
        "icon": urlicon + "qd.webp",
    },
    {
        "name": "#枫酱超市",
        "describe": "购买道具地方",
        "icon": urlicon + "cs.jpg",
    },
    {
        "name": "#个人仓库",
        "describe": "查看自己道具",
        "icon": urlicon + "ck.jpeg",
    },
    {
        "name": "#使用道具1",
        "describe": "使用对应道具",
        "icon": urlicon + "qt.jpg",
    },
    {
        "name": "其他功能",
        "describe": "正在🔥开发中",
        "icon": urlicon + "qt.jpg",
    }
]
export { data };