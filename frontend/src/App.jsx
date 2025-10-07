import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";

import Home from "./pages/home";
import AppointmentForm from "./pages/appointment/appointmentform";
import AppointmentsPage from "./pages/appointment/AppointmentsPage";
import Guideform from "./pages/Guide/GuideSchedulingForm";
import Guidedashboard from "./pages/Guide/Guidedashboard";

import PackageForm from "./pages/Services/PackageForm";
import Packages from "./pages/Services/PackagePage";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import TouristDashboard from "./pages/dashboard/TouristDashboard";
import GuideDashboard from "./pages/dashboard/GuideDashboard";
import PackageProviderDashboard from "./pages/dashboard/PackageProviderDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import AdvertisementManagement from "./pages/dashboard/AdvertisementManagement";

import DashboardLayout from "./components/layout/DashboardLayout";
import ProfileEdit from "./components/ProfileEdit";
import ReviewForm from "./pages/Review/ReviewForm";
import ReviewList from "./pages/Review/ReviewList";

import Header from "./components/Header";
import Footer from "./components/Footer";

// Component to handle authenticated routes
const AuthenticatedRoutes = () => {
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

  // Redirect based on role
  const renderDashboard = () => {
    if (!authState.isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    switch (authState.user?.role) {
      case "Tourist":
        return <Navigate to="/dashboard/tourist" replace />;
      case "Guide":
        return <Navigate to="/dashboard/guide" replace />;
      case "PackageProvider":
        return <Navigate to="/dashboard/package-provider" replace />;
      case "Admin":
        return <Navigate to="/dashboard/admin" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  };

  // Protected routes with role check
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
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/apform" element={<AppointmentForm />} />
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/guideform" element={<Guideform />} />
      <Route path="/guidedashboard" element={<Guidedashboard />} />
      <Route path="/addpackage" element={<PackageForm />} />
      <Route path="/packages" element={<Packages />} />
      <Route path="/reviewform" element={<ReviewForm />} />
      <Route path="/reviewlist" element={<ReviewList />} />

      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          authState.isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/register"
        element={
          authState.isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Register />
          )
        }
      />

      {/* Dashboard Redirect */}
      <Route path="/dashboard" element={renderDashboard()} />

      {/* Role-based Dashboards */}
      <Route
        path="/dashboard/tourist"
        element={renderProtectedRoute(
          <DashboardLayout>
            <TouristDashboard />
          </DashboardLayout>,
          ["Tourist"]
        )}
      />

      <Route
        path="/dashboard/tourist/profile"
        element={renderProtectedRoute(
          <DashboardLayout>
            <ProfileEdit />
          </DashboardLayout>,
          ["Tourist"]
        )}
      />

      <Route
        path="/dashboard/guide"
        element={renderProtectedRoute(
          <DashboardLayout>
            <GuideDashboard />
          </DashboardLayout>,
          ["Guide"]
        )}
      />

      <Route
        path="/dashboard/guide/profile"
        element={renderProtectedRoute(
          <DashboardLayout>
            <ProfileEdit />
          </DashboardLayout>,
          ["Guide"]
        )}
      />

      <Route
        path="/dashboard/package-provider"
        element={renderProtectedRoute(
          <DashboardLayout>
            <PackageProviderDashboard />
          </DashboardLayout>,
          ["PackageProvider"]
        )}
      />

      <Route
        path="/dashboard/package-provider/profile"
        element={renderProtectedRoute(
          <DashboardLayout>
            <ProfileEdit />
          </DashboardLayout>,
          ["PackageProvider"]
        )}
      />

      <Route
        path="/dashboard/admin"
        element={renderProtectedRoute(
          <DashboardLayout>
            <AdminDashboard />
          </DashboardLayout>,
          ["Admin"]
        )}
      />

      <Route
        path="/dashboard/admin/advertising"
        element={renderProtectedRoute(
          <DashboardLayout>
            <AdvertisementManagement />
          </DashboardLayout>,
          ["Admin"]
        )}
      />

      {/* Generic Profile for All Roles */}
      <Route
        path="/profile"
        element={renderProtectedRoute(
          <DashboardLayout>
            <ProfileEdit />
          </DashboardLayout>,
          ["Tourist", "Guide", "PackageProvider", "Admin"]
        )}
      />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Header />
          <AuthenticatedRoutes />
          <Footer />
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

