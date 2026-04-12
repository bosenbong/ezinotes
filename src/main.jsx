import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

console.log('EziNotes starting...')

const root = document.getElementById('root')
if (!root) {
  console.error('Root element not found!')
  document.body.innerHTML = '<div style="padding:20px;text-align:center;">Error: Root element missing</div>'
} else {
  window.onerror = (msg, url, line) => {
    document.body.innerHTML = '<div style="padding:20px;text-align:center;color:red;">Error: ' + msg + ' (line ' + line + ')</div>'
  }
  try {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  } catch(e) {
    document.body.innerHTML = '<div style="padding:20px;text-align:center;color:red;">React Error: ' + e.message + '</div>'
  }
}