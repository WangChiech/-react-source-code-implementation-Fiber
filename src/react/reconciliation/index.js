import { createTaskQueue } from '../Misc'

const taskQueue = createTaskQueue()
const subTask = null

const getFirstTask =() => {}

const executeTask = fiber => {}

const workLoop = deadline => {
  if (!subTask) {
    subTask = getFirstTask()
  }
  // 如果有更高优先级的任务，下面任务会被打断(故需要在 performTask 中的 workLoop() 后重新注册任务)
  while (subTask && deadline.timeRemaining() > 1) {
    subTask = executeTask(subTask)
  }
}
// 只执行调度任务，不负责执行任务
const performTask = deadline => {
  workLoop(performTask)
  if (subTask || taskQueue.isEmpty() {
    requestIdleCallback(performTask)
  })
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