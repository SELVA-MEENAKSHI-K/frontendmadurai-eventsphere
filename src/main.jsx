import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Leaflet CSS — must be imported before any Leaflet/react-leaflet components
import 'leaflet/dist/leaflet.css'

// Tailwind + global styles
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
