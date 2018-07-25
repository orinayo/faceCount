import React from 'react'
import ReactDOM from 'react-dom'
import App from './containers/App'
// import Modal from './components/Modal/Modal'
import registerServiceWorker from './registerServiceWorker'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'tachyons'
import './index.css'

ReactDOM.render(<App />, document.getElementById('root'))
// To create a Modal using portal
// ReactDOM.render(<Modal />, document.getElementById('modal-root'))
registerServiceWorker()
