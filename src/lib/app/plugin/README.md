### 插件编写目录
    1.首先随意创建一个.ts文件
    2.暴露一个Sendable类型函数返回值
    3.在index里面runplugin()函数内注册
### 自定义道具编写
    1.config拟定一个道具type参数填入plugin。effect填入id
    2.index.ts的pluginprop函数下根据effect填写的id判断执行逻辑
    3.编写自己的执行逻辑