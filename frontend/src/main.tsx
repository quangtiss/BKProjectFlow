import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './routes/auth-context.tsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
