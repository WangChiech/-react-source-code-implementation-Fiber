import React, { render, Component } from './react'

const root = document.querySelector('#root')

const jsx = (
  <div>
    <p>Hello React</p>
    <p>Hi Fiber</p>
  </div>
)

// render(jsx, root)

// setTimeout(() => {
//   const jsx = (
//     <div>
//       <div>react</div>
//     </div>
//   )
//   render(jsx, root)
// }, 2000)

class Greating extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: 'state测试'
    }
  }
  render () {
    return <div>
      类组件测试
      <div>{ this.state.name }-{ this.props.title }</div>
      <button onClick={() => this.setState({ name: 'state已更改' })}>button</button>
    </div>
  }
}

render(<Greating title="props测试"/>, root)


function Fn (props) {
  return <div>函数组件测试 { props.title }</div>
}

// render(<Fn title="props-title"/>, root)
