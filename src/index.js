import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import App from './pages/index'
import Friend from './pages/friend'

import 'antd/dist/antd.css'
import './styles/common.global.css'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/detail" component={Friend} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
)
registerServiceWorker()
