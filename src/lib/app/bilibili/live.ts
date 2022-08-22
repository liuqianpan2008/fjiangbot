import { Live } from "bilicaptain/lib";
import { readBiliCredential } from "./login"
async function livesign(qq: number) {
    let Bilidata = readBiliCredential(qq)
    if (Bilidata) {
        try {
            let R = await new Live(Bilidata).sign()
            console.log(JSON.stringify(R));
            return `签到成功！获得${R.text}`

        } catch (error: any) {
            return error.message;
        }
    } else {
        return "请先使用#登陆功能，登陆B战"
    }

}
export default livesign