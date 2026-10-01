import React from 'react'
import ReactDom from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './styles/styles.css'
import App from './App.jsx'

ReactDom.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)