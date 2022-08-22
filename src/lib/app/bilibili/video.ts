import { Video } from 'bilicaptain'
import { GroupMessageEvent, PrivateMessageEvent, segment, Sendable } from 'oicq'
import { rules } from '../plugin'
import { readBiliCredential } from './login'
let videos: Map<number, string> = new Map<number, string>()
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
            return "请先使用 #登陆 功能，登陆B站"
        }
    }
    catch (error: any) {
        return `三连出错！${error.message}`;
    }
}
async function Videoinfo(qq: number, bv: string): Promise<Sendable> {
    let Bilidata = readBiliCredential(qq)
    if (Bilidata) {
        let video = new Video(Bilidata)
        if (bv.indexOf("BV") !== -1) {
            bv = bv.replace("BV", "")
        }
        let r
        try {
            r = await video.detail(bv)
        } catch (error: any) {
            return `视频获取错误${error.message}`;
        }
        videos.set(qq, bv)
        return [
            `标题：${r.title}`,
            segment.image(r.pic),
            `播放地址：https://www.bilibili.com/video/${r.bvid}`, "\n",
            `分区：${r.tname}作者：${r.owner.name}`, "\n",
            `简介:${subString(r.desc, 100)}`, "\n",
            `播放量：${r.stat.view},👍：${r.stat.like},👎：${r.stat.dislike},🪙：${r.stat.coin},📂：${r.stat.favorite},💬：${r.stat.reply}\n`,
        ]

    } else {
        return "请先使用 #登陆 功能，登陆B站"
    }
}

// async function comment(qq: number, bv: string, content: string) {
//     let Bilidata = readBiliCredential(qq)
//     if (Bilidata) {

//         if (bv.indexOf("BV") !== -1) {
//             bv = bv.replace("BV", "")
//         }
//         console.log(bv, content);
//         let video = new Video(Bilidata, bv)
//         try {
//             console.log(JSON.stringify(await video.comment.add(content)));
//             return `评论${content}成功`
//         } catch (error: any) {
//             return `评论出错！${error.message}`;
//         }

//     } else {
//         return "请先使用 #登陆 功能，登陆B站"
//     }
// }
function operationVideo(event: PrivateMessageEvent | GroupMessageEvent) {
    let bv = videos.get(event.sender.user_id)
    if (bv !== undefined) {
        videos.delete(event.sender.user_id)
        event.message.forEach(msg => {
            if (msg.type === "text") {
                rules('^#?同意三连$', msg, async () => {
                    let res = await sanlian(event.sender.user_id, bv as string)
                    if (res) {
                        event.reply(res).then(res => { }).catch(err => {
                            console.log(err)
                        })
                    }
                })
                // rules('^#?评论(.*)', msg, async () => {
                //     let common = msg.text.split(new RegExp("^#?评论(.*)"))[1]
                //     let res = await comment(event.sender.user_id, bv as string, common)
                //     if (res) {
                //         event.reply(res).then(res => { }).catch(err => {
                //             console.log(err)
                //         })
                //     }
                // })
            }
        })
    }
}
function subString(str: string, len: number) {
    let strlen = 0;
    let s = "";
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 128) {
            strlen += 2;
        } else {
            strlen++;
        }
        s += str.charAt(i);
        if (strlen >= len) {
            return s + "...";
        }
    }
    return s;
}
export { Videoinfo, sanlian, operationVideo } 