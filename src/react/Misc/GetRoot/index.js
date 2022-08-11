const getRoot = fiber => {
  let rootFiber = fiber.parent
  while (rootFiber.parent) {
    rootFiber = rootFiber.parent
  }
  return rootFiber
}

export default getRoot