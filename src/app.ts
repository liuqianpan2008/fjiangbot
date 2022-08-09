import { createClient } from 'oicq';
import QQc from './config/config';
import { friend } from './lib/message';
const QQbot = createClient(QQc.qq, {
    log_level: QQc.log,
    platform: QQc.platform,
    resend: false,
    data_dir: './src/data',
})
//密码 or 扫码登陆
QQbot.on('system.login.qrcode', (e) => {
    process.stdin.once("data", () => {
        QQbot.login();
    });
}).login(QQc.password)
//滑块验证提交
QQbot.on("system.login.slider", function (e) {
    process.stdin.once("data", (input: string) => {
        QQbot.submitSlider(input);
    });
});
//设备锁
QQbot.on("system.login.device", function (e) {
    process.stdin.once("data", () => {
        this.login();
    });
});
QQbot.on("system.login.error", function (e) {
    if (e.code == 1) this.logger.error("请打开config.ts，修改输入正确的密码");
    process.exit();
});
//监听上线事件
QQbot.on("system.online", async () => {
    QQbot.logger.mark("QQ上线成功")
    // 监听私聊事件
    QQbot.on('message.private.friend', async (event) => {
        await friend(event, QQbot);
    })
});


