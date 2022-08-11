import { createDOMElement } from "../../DOM"
import { createReactInstance } from '../index'

const createStateNode = fiber => {
  if (fiber.tag === 'host_component') {
    return createDOMElement(fiber)
  } else {
    return createReactInstance(fiber)
  }
}

export default createStateNode
