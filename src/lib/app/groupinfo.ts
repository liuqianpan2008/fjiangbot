import axios from 'axios'
import moment from 'moment'
import { Member } from 'oicq'
moment(new Date()).format('YYYY-MM-DD')
async function groupinfo(group: Member) {
    while (group.info) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        break;
    }
    return ({
        name: group?.info?.nickname ?? "获取失败！",
        Avatar: `https://q1.qlogo.cn/g?b=qq&s=100&nk=${group.uid}`,
        isnume: group?.mute_left > 0 ? true : false,
        joinTime: moment(new Date(group.info?.join_time ?? 0).getTime() * 1000).format('YYYY-MM-DD'),
        lastTime: moment(new Date(group.info?.last_sent_time ?? 0).getTime() * 1000).format('YYYY-MM-DD'),
        LinKing: (await axios.get(`http://api.guaqb.cn/v1/onesaid/`))?.data ?? "获取失败！"
    })
}
export default groupinfo;