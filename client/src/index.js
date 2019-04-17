import React from 'react'
import ReactDOM from 'react-dom'
import './assets/css/sass/themes/gogo.light.purple.scss'
const rootEl = document.getElementById('root')
/*
color options :
	 'light.purple'		'dark.purple'
	 'light.blue'		  'dark.blue'
	 'light.green'		'dark.green'
	 'light.orange'		'dark.orange'
	 'light.red'		  'dark.red'
*/
var color = 'light.purple'
if (localStorage.getItem('themeColor')) {
  color = localStorage.getItem('themeColor')
}

let render = () => {
  const MainApp = require('./App').default

  ReactDOM.render(
    <MainApp />,
      rootEl
    )
}

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default

    render(
      <NextApp />,
        rootEl
      )
  })
}

render()
