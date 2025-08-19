import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import MainAppRouter from './routes/MainAppRouter'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <MainAppRouter />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
