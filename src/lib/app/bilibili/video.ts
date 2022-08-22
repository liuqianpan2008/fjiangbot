import { Video } from 'bilicaptain'
import { readBiliCredential } from './login'
async function sanlian(qq: number, bv: string) {
    try {
        let Bilidata = readBiliCredential(qq)
        if (Bilidata) {
            let video = new Video(Bilidata)
            if (bv.indexOf("BV") !== -1) {
                bv = bv.replace("BV", "")
            }
            let r = await video.triple(bv)
            return `三连视频(${(await video.detail(bv)).title})成功！点赞：${r.like ? "成功" : "失败"}，投币：${r.coin ? "成功" : "失败"}数量：${r.multiply}，收藏：${r.fav ? "成功" : "失败"}`
        } else {
            return "请先使用#登陆功能，登陆B站"
        }
    }
    catch (error: any) {
        return `三连出错！${error.message}`;
    }
}
async function Videoinfo(qq: number, bv: string) {
    try {
        let Bilidata = readBiliCredential(qq)
        if (Bilidata) {
            let video = new Video(Bilidata)
            if (bv.indexOf("BV") !== -1) {
                bv = bv.replace("BV", "")
            }
            let r = await video.detail(bv)
            return ``
        } else {
            return "请先使用#登陆功能，登陆B站"
        }
    }
    catch (error: any) {
        return `视频获取错误${error.message}`;
    }
}
export default sanlian