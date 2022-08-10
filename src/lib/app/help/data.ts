import path from "path";

type dataT = {
    name: string,
    describe: string,
    icon: string,
}
let urlicon = `${path.resolve()}/src/lib/app/help/icon/`
let data: Array<dataT> = [
    {
        "name": "功能1",
        "describe": "功能1描述",
        "icon": urlicon + "1.jpg",
    },
    {
        "name": "功能2",
        "describe": "功能2描述",
        "icon": urlicon + "1.jpg",
    }
]
export { data };