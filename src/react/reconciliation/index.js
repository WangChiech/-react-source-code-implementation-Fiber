import { createTaskQueue, arrified, createStateNode, getTag } from '../Misc'

const taskQueue = createTaskQueue()
let subTask = null
let pendingCommit = null

const commitAllWork = fiber => {
  fiber.effects.forEach(item => {
    if (item.effectTag === 'placement') {
      let parentFiber = item.parent
      while (['class_component', 'function_component'].includes(parentFiber.tag)) {
        parentFiber = parentFiber.parent
      }
      if (item.tag === 'host_component') {
        parentFiber.stateNode.appendChild(item.stateNode)
      }
    }
  })
}

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

const reconcileChildren = (fiber, children) => {
  // children 可能是对象或数组
  const arrifiedChildren = arrified(children)
  
  let index = 0
  let numberOfElements = arrifiedChildren.length
  let element = null
  let newFiber = null
  let prevFiber = null

  while (index < numberOfElements) {
    element = arrifiedChildren[index]
    newFiber = {
      type: element.type,
      props: element.props,
      tag: getTag(element), // host_component 普通节点 || 根节点 host_root
      effects: [],
      effectTag: "placement",
      parent: fiber
    }
    newFiber.stateNode = createStateNode(newFiber)

    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevFiber.sibling = newFiber
    }
    prevFiber = newFiber
    index++
  }
}

const executeTask = fiber => {
  // 构建子级 fiber 对象
  if (fiber.tag === 'class_component') {
    reconcileChildren(fiber, fiber.stateNode.render())
  } else if (fiber.tag === 'function_component') {
    reconcileChildren(fiber, fiber.stateNode(fiber.props))
  } else {
    reconcileChildren(fiber, fiber.props.children)
  }
  if (fiber.child) {
    return fiber.child
  }

  // 如果存在同级 返回同级 构建同级的子级; 如果同级不存在 返回到父级 看父级是否有同级
  let currentExecutelyFiber = fiber
  while (currentExecutelyFiber.parent) {
    currentExecutelyFiber.parent.effects = currentExecutelyFiber.parent.effects.concat(
      currentExecutelyFiber.effects.concat([currentExecutelyFiber])
    )
    if (currentExecutelyFiber.sibling) {
      return currentExecutelyFiber.sibling
    }
    currentExecutelyFiber = currentExecutelyFiber.parent
  }
  pendingCommit = currentExecutelyFiber
}

const workLoop = deadline => {
  if (!subTask) {
    // 返回 fiber 对象
    subTask = getFirstTask()
  }
  // 如果有更高优先级的任务，下面任务会被打断(故需要在 performTask 中的 workLoop() 后重新注册任务)
  while (subTask && deadline.timeRemaining() > 1) {
    subTask = executeTask(subTask)
  }
  if (pendingCommit) {
    commitAllWork(pendingCommit)
  }
}
// 只执行调度任务，不负责执行任务
const performTask = deadline => {
  workLoop(deadline)
  if (subTask || !taskQueue.isEmpty()) {
    requestIdleCallback(performTask)
  }
}
// element(jsx  经 babel 转成的 virtul DOM) 是 dom(root dom元素) 的子集
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