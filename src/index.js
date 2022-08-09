import React, { render } from './react'

const root = document.querySelector('#root')

const jsx = (
  <div>
    <p>Hello React</p>
  </div>
)

render(jsx, root)
