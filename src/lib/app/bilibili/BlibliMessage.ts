import { Message } from 'bilicaptain'
import { readBiliCredential } from "./login"
async function getBlibliMessage(qq: number, uid: number, c: string) {
    let Bilidata = readBiliCredential(qq)
    if (Bilidata) {
        try {
            let message = new Message(Bilidata)
            let seedmsg = await message.sendMsg(uid, c)
            if (typeof seedmsg !== 'string') {
                return '发送成功'
            } else {
                return seedmsg
            }

        } catch (error: any) {
            return error.message;
        }
    } else {
        return '请先登录'
    }
}
export { getBlibliMessage }