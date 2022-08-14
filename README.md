# 枫酱BOT
> # 你不给🌟，我不给🌟，放在谁身上谁都放弃

![issues](https://img.shields.io/github/issues/liuqianpan2008/fjiangbot)![forks](https://img.shields.io/github/forks/liuqianpan2008/fjiangbot)![stars](https://img.shields.io/github/stars/liuqianpan2008/fjiangbot)![nodejs](https://img.shields.io/badge/nodejs-14%2B-brightgreen)

### 启动方式
  1. 克隆这个项目`git clone https://github.com/liuqianpan2008/fjiangbot.git`
  2. 安装依赖 `npm i`
  3. 修改`src/config/.config.ts` 为 `config.ts`,并设置相关内容
  4. 运行`npm run app`

### 功能

<details>
<summary>#宵禁</summary>
<img width="362" alt="xj1" src="https://user-images.githubusercontent.com/80571808/184520289-8e1499fb-826b-480a-b469-c12f0c85c63b.PNG">
<img width="372" alt="xj2" src="https://user-images.githubusercontent.com/80571808/184520303-e982be55-c3cd-4e07-842b-8f216aeafe10.PNG">
</details>

<details>
<summary>#进群验证</summary>
<img src="https://user-images.githubusercontent.com/80571808/184520311-22430cf1-7dd9-4f55-b8bd-bf237c891420.PNG" alt="#刻晴">
</details>

<details>
<summary>#群管</summary>
<img width="368" alt="qg" src="https://user-images.githubusercontent.com/80571808/184520315-912539ad-6378-48d2-869d-a0f7ca0e9af8.png">
</details>

<details>
<summary>#签到</summary>
<img width="368" alt="qg" src="https://user-images.githubusercontent.com/80571808/184520362-509ddd44-dca8-451a-9935-bf025e7994ca.PNG">
</details>

<details>
<summary>#道具系统</summary>
<img width="368" alt="qg" src="https://user-images.githubusercontent.com/80571808/184520365-48f72f0b-6496-4ac6-8107-c8b6945f3e73.PNG">
<img width="368" alt="qg" src="https://user-images.githubusercontent.com/80571808/184520369-0eb273da-8e04-4bc6-8cee-1791e75b20b2.PNG">
</details>
## 道具系统

> 🤖️特色功能

#### 金币获取

首先玩家需要通过`#签到`等功能获取金币

#### 道具获取

拥有充足的金币便可在（`#枫酱超市`）道具商城购买，或者使用抽奖卡获得

* 购买时候需要使用超市功能查看商店名称后面的道具编号
* 目前只支持
  * 道具编号取决于‘config.ts’文件下有关道具配置的id

#### 道具使用

`#使用道具+编号`使用对应道具 eg：`#使用道具1`即使用一号道具

* 使用道具前请确认自己已经拥有至少一个该道具
* 无改道具会显示`购买`

#### 道具配置
 ##### 通用配置
  * id道具编号,禁止重名
  * price道具售卖价格只接受整数

 ##### 禁言卡

> 禁言群里的人

*  type必须输入 `"jy"`
* effect为禁言时长必须是`整数`单位`秒`

##### cdk卡

> 使用一定金币兑换密钥

* effect 需要和`cdk.json`相对应

##### 抽奖卡

* effect配置

  * type仅仅支持`gold`(金币)或者`props`(道具)

  * value

    * 如果是金币则填入中奖后金币数量
    * 如果是道具则填入道具id

  probability

  * 概率为0则100%抽到，概率为1则抽到1/2,概率为3则抽到1/3...只接受整数



### 帮助&反馈

QQ群：877894787

​    



