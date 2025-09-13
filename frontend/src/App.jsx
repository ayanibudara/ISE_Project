

import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRoutes from './pages/User';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Header />
          <AppRoutes />
          <Footer />
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;