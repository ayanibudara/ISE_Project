import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import { useState, useEffect } from 'react'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import TouristDashboard from './pages/dashboard/TouristDashboard'
import GuideDashboard from './pages/dashboard/GuideDashboard'
import GuideProfile from './pages/dashboard/GuideProfile'
import PackageProviderDashboard from './pages/dashboard/PackageProviderDashboard'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import NotFound from './pages/NotFound'
import DashboardLayout from './components/layout/DashboardLayout'
import ProfileEdit from './components/ProfileEdit'

const AppRoutes = () => {
  const { authState, checkAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  const renderDashboard = () => {
    if (!authState.isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    switch (authState.user?.role) {
      case 'Tourist':
        return <Navigate to="/dashboard/tourist" replace />;
      case 'Guide':
        return <Navigate to="/dashboard/guide" replace />;
      case 'PackageProvider':
        return <Navigate to="/dashboard/package-provider" replace />;
      case 'Admin':
        return <Navigate to="/dashboard/admin" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  };

  // Helper function to check authentication and role permissions
  const renderProtectedRoute = (element, allowedRoles) => {
    if (!authState.isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(authState.user?.role)) {
      return <Navigate to="/dashboard" replace />;
    }

    return element;
  };

  return (
    <Routes>
      <Route path="/login" element={authState.isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={authState.isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
      
      <Route path="/dashboard" element={renderDashboard()} />
      
      <Route
        path="/dashboard/tourist"
        element={renderProtectedRoute(
          <DashboardLayout>
            <TouristDashboard />
          </DashboardLayout>,
          ['Tourist']
        )}
      />

      <Route
        path="/dashboard/tourist/profile"
        element={renderProtectedRoute(
          <DashboardLayout>
            <ProfileEdit />
          </DashboardLayout>,
          ['Tourist']
        )}
      />
      
      <Route
        path="/dashboard/guide"
        element={renderProtectedRoute(
          <DashboardLayout>
            <GuideDashboard />
          </DashboardLayout>,
          ['Guide']
        )}
      />
      
      <Route
        path="/dashboard/guide/profile"
        element={renderProtectedRoute(
          <DashboardLayout>
            <ProfileEdit />
          </DashboardLayout>,
          ['Guide']
        )}
      />
      
      <Route
        path="/dashboard/package-provider"
        element={renderProtectedRoute(
          <DashboardLayout>
            <PackageProviderDashboard />
          </DashboardLayout>,
          ['PackageProvider']
        )}
      />

      <Route
        path="/dashboard/package-provider/profile"
        element={renderProtectedRoute(
          <DashboardLayout>
            <ProfileEdit />
          </DashboardLayout>,
          ['PackageProvider']
        )}
      />

      {/* General profile route for any authenticated user */}
      <Route
        path="/profile"
        element={renderProtectedRoute(
          <DashboardLayout>
            <ProfileEdit />
          </DashboardLayout>,
          ['Tourist', 'Guide', 'PackageProvider', 'Admin']
        )}
      />
      
      <Route
        path="/dashboard/admin"
        element={renderProtectedRoute(
          <DashboardLayout>
            <AdminDashboard />
          </DashboardLayout>,
          ['Admin']
        )}
      />

      <Route
        path="/dashboard/admin/advertising"
        element={renderProtectedRoute(
          <DashboardLayout>
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Advertising Management</h1>
              <p className="text-gray-600">Advertising management features will be implemented here.</p>
            </div>
          </DashboardLayout>,
          ['Admin']
        )}
      />
      
      <Route path="/" element={<Navigate to={authState.isAuthenticated ? "/dashboard" : "/login"} replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
