//导入依赖
import { Sendable } from "oicq";

//这是一个实例插件 注意往回值为Sendable
function egPlugin(): Sendable {
    // 这里写清楚执行逻辑
    return { type: 'text', text: "这是一个实例插件" }
}
//最后暴露出去
export default egPlugin 