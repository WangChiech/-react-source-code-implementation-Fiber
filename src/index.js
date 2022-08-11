import React, { render, Component } from './react'

const root = document.querySelector('#root')

const jsx = (
  <div>
    <p>Hello React</p>
    <p>Hi Fiber</p>
  </div>
)

// render(jsx, root)

class Greating extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    return <div>类组件测试 { this.props.title }</div>
  }
}

render(<Greating title="props-title"/>, root)


function Fn (props) {
  return <div>函数组件测试 { props.title }</div>
}

// render(<Fn title="props-title"/>, root)
