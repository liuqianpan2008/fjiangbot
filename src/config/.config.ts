
import { Platform } from "oicq";
import { LogLevel } from "oicq/lib/client";

type QQcT = {
    qq: number,
    password?: string,
    log: LogLevel,
    platform: Platform
}

let QQc: QQcT = {
    qq: 123456789,
    password: '',
    log: "info",
    platform: Platform.aPad
};

export default QQc;
