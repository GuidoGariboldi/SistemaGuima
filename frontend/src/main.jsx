import React from 'react'
import ReactDom from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './styles/styles.css'
import App from './App.jsx'
import { AuthProvider } from './context/auth-context'

ReactDom.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>,
)
