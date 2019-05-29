import React from 'react'
import ReactDOM from 'react-dom'
import App from './pages/index'
import 'antd/dist/antd.css'

import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
