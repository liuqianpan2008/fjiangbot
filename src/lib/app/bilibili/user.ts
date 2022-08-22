import { User } from "bilicaptain";
import { readBiliCredential } from "./login";
async function UserInfo(qq: number) {
    let Bilidata = readBiliCredential(qq)
    if (Bilidata) {
        try {
            let user = new User(Bilidata)
            let info = await user.myInfo()
            return {
                name: info.name,
                Avatar: info.face,
                Gold: info.coins,
                msg: info.sign,
                day: "lv" + info.level,
            }
        } catch (error: any) {
            return error.message;
        }
    } else {
        return -1
    }
}
export { UserInfo };