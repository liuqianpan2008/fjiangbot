import fs from 'fs';
import schedule from 'node-schedule';
import { Client, segment } from 'oicq';
import path from 'path';
import { groupc } from '../config/config';
import { HtmlImg } from './puppeteer';
import { bilibilidata } from './app/bilibili/login';
import { Live } from 'bilicaptain/lib';
import moment from 'moment';

async function timing(bot: Client) {
    //每3秒执行一次
    bot.getGroupList().forEach(async (group) => {
        let c = groupc.get(group.group_id) ?? groupc.get(1);
        if (c?.Iscurfew === true) {
            console.log(c.curfewTime);
            let startTime = schedule.scheduleJob(c.curfewTime, async () => {
                await bot.sendGroupMsg(group.group_id, {
                    type: "image",
                    file: `base64://${await HtmlImg("curfew", {
                        Avatar: `https://p.qlogo.cn/gh/${group.group_id}/${group.group_id}/${100}`,
                        title: "夜已深，请注意休息",
                        content: "已开启宵禁模式"
                    }, group.group_id)}`
                });
                await bot.pickGroup(group.group_id).muteAll(true)
                bot.logger.info(`${group.group_id}宵禁已开闭，下次宵禁将在${formatTime(startTime.nextInvocation())}开启`);
            })
            bot.logger.info(`群${group.group_id}宵禁已开闭，宵禁将在${formatTime(startTime?.nextInvocation() ?? 0)}开启`);
            let endTime = schedule.scheduleJob(c.curfewEndTime, async () => {
                await bot.sendGroupMsg(group.group_id, {
                    type: "image",
                    file: `base64://${await HtmlImg("curfew", {
                        Avatar: `https://p.qlogo.cn/gh/${group.group_id}/${group.group_id}/${100}`,
                        title: "天亮了，开始摸鱼了",
                        content: "已关闭宵禁模式"
                    }, group.group_id)}`
                });
                await bot.pickGroup(group.group_id).muteAll(false)
                bot.logger.info(`${group.group_id}宵禁关闭，下次宵禁将在${formatTime(endTime.nextInvocation())}关闭`);
            })
            bot.logger.info(`宵禁将在${formatTime(endTime?.nextInvocation() ?? 0)}关闭`);
        }
    })
    // 每周四中午12点执行一次
    let Time = schedule.scheduleJob('0 0 12 * * 4', async () => {
        bot.logger.info('执行KFC任务');
        bot.getGroupList().forEach(async (group) => {
            bot.sendGroupMsg(group.group_id,
                segment.video(`${path.resolve()}/src/modular/video/v50.mp4`))
                .catch(err => bot.logger.error(err));
            await new Promise(resolve => setTimeout(resolve, 5000));
        })
        bot.logger.info(`CFK下次执行时间${formatTime(Time.nextInvocation())}`)
    })
    bot.logger.info(`CFK下次执行时间${formatTime(Time.nextInvocation())}`)
    //每天凌晨1点执行一次
    let Time1 = schedule.scheduleJob('0 0 1 * * *', async () => {
        bot.logger.info('执行B站签到');
        let data: bilibilidata[] = JSON.parse(fs.readFileSync(`${path.resolve()}/src/data/bilibili.json`, 'utf-8'))
        data.forEach(async itme => {
            await (new Live(itme.bilibili).sign())
            await new Promise(resolve => setTimeout(resolve, 15000));
        })
        bot.logger.info(`B站签到下次执行时间${formatTime(Time1.nextInvocation())}`)
    })
    bot.logger.info(`B站签到下次执行时间${formatTime(Time1.nextInvocation())}`)

}
//格式化当前时间
function formatTime(date: Date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}
export default timing;
