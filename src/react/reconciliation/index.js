import { createTaskQueue } from '../Misc'

const taskQueue = createTaskQueue()
let subTask = null

const getFirstTask =() => {
  // 从任务队列中获取任务
  const task = taskQueue.pop()
  //返回最外层节点的 fiber 对象
  return {
    props: task.props, // 节点属性
    stateNode: task.dom, // 节点 DOM 对象
    tag: 'host_root', // 节点标记 (hostRoot | hostComponent | classComponent | functionComponent)
    effects: [], // 存储需要更改的 fiber 对象
    child: null // 子级 fiber
  }
}

const executeTask = fiber => {}

const workLoop = deadline => {
  if (!subTask) {
    // 返回 fiber 对象
    subTask = getFirstTask()
    console.log('subTask', subTask)
  }
  // 如果有更高优先级的任务，下面任务会被打断(故需要在 performTask 中的 workLoop() 后重新注册任务)
  while (subTask && deadline.timeRemaining() > 1) {
    subTask = executeTask(subTask)
    console.log('executeTask return', subTask)
  }
}
// 只执行调度任务，不负责执行任务
const performTask = deadline => {
  workLoop(deadline)
  if (subTask || taskQueue.isEmpty()) {
    requestIdleCallback(performTask)
  }
}
// element(jsx) 是 dom(root dom元素) 的子集
export const render =  (element, dom) => {
  /**
   * 1. 向任务队列添加任务(通过 vdom 对象 构建 fiber 对象)
   * 2. 指定浏览器空闲时执行任务
   */

  taskQueue.push({
    dom,
    props: { children: element }
  })
  
  requestIdleCallback(performTask)
}