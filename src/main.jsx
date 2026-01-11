import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <GoogleOAuthProvider clientId='172976526782-erll2oa7c632c6t2mf0vs0e6i71c2fbr.apps.googleusercontent.com'>
      <App />
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
