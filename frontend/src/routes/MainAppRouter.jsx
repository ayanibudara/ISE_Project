import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import TouristDashboard from '../pages/dashboard/TouristDashboard';
import GuideDashboard from '../pages/dashboard/GuideDashboard';
import GuideProfile from '../pages/dashboard/GuideProfile';
import ServiceProviderDashboard from '../pages/dashboard/ServiceProviderDashboard';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProfileEdit from '../components/ProfileEdit';

const MainAppRouter = () => {
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
      case 'ServiceProvider':
        return <Navigate to="/dashboard/service-provider" replace />;
      case 'Admin':
        return <Navigate to="/dashboard/admin" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  };

  return (
    <Routes>
      <Route path="/login" element={authState.isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={authState.isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
      
      <Route path="/dashboard" element={renderDashboard()} />
      
      <Route
        path="/dashboard/tourist"
        element={
          <ProtectedRoute allowedRoles={['Tourist']}>
            <DashboardLayout>
              <TouristDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/tourist/profile"
        element={
          <ProtectedRoute allowedRoles={['Tourist']}>
            <DashboardLayout>
              <ProfileEdit />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard/guide"
        element={
          <ProtectedRoute allowedRoles={['Guide']}>
            <DashboardLayout>
              <GuideDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard/guide/profile"
        element={
          <ProtectedRoute allowedRoles={['Guide']}>
            <DashboardLayout>
              <ProfileEdit />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard/service-provider"
        element={
          <ProtectedRoute allowedRoles={['ServiceProvider']}>
            <DashboardLayout>
              <ServiceProviderDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/service-provider/profile"
        element={
          <ProtectedRoute allowedRoles={['ServiceProvider']}>
            <DashboardLayout>
              <ProfileEdit />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* General profile route for any authenticated user */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['Tourist', 'Guide', 'ServiceProvider', 'Admin']}>
            <DashboardLayout>
              <ProfileEdit />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/admin/advertising"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <DashboardLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Advertising Management</h1>
                <p className="text-gray-600">Advertising management features will be implemented here.</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      
      <Route path="/" element={<Navigate to={authState.isAuthenticated ? "/dashboard" : "/login"} replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MainAppRouter;
