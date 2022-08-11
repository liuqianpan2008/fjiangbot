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
        "name": "#禁｜解｜ban|@at",
        "describe": "群管功能",
        "icon": urlicon + "qt.jpg",
    },
    {
        "name": "其他功能",
        "describe": "正在🔥开发中",
        "icon": urlicon + "qt.jpg",
    }
]
export { data };