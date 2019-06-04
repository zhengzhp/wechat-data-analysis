import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { Icon, Affix } from 'antd'
import App from './pages/index'
import Friend from './pages/friend'
import 'antd/dist/antd.css'
import './styles/common.global.css'
import registerServiceWorker from './registerServiceWorker'

const Back = withRouter(props => {
  const { history, children } = props
  const goBack = () => {
    history.goBack()
  }
  return (
    <Fragment>
      <Affix>
        <div className="back">
          <Icon onClick={goBack} className="back-arrow-left" type="arrow-left" />
          <span>返回上一步</span>
        </div>
      </Affix>
      {children}
    </Fragment>
  )
})

function Person() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={App} />
        <Back>
          <Switch>
            <Route exact path="/friend/:id" component={Friend} />
          </Switch>
        </Back>
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  )
}
ReactDOM.render(<Person />, document.getElementById('root'))
registerServiceWorker()
