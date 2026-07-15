import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* @ts-expect-error type incompatibility */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)
