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
import AboutUs from "./pages/aboutus";
import Contact from "./pages/contactus";
import AppointmentForm from "./pages/appointment/appointmentform";
import AppointmentsPage from "./pages/appointment/AppointmentsPage";
//import Guideform from "./pages/Guide/GuideSchedulingForm";
//import GuideAssignForm from "./pages/admin/GuideAssignForm"; // 🆕 ADD THIS
import Guidedashboard from "./pages/Guide/Guidedashboard";
import GuideRequestsTable from "./pages/admin/GuideRequestsTable";
import GuideAssignmentForm from "./pages/admin/GuideAssignmentForm";




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


import Chatbot from "./AI/chatbot";
//import ManagePackages from "./pages/Services/ManagePackage";
import PackageView from "./pages/Services/PackageView";
import EditPackageForm from "./pages/Services/EditpackageForm";
import UpdateAppointmentPage from "./pages/appointment/UpdateAppointmentPage"

import Header from "./components/Header";
import Footer from "./components/Footer";
import RegisterGuide from "./pages/Guide/RegisterGuide";
//import RegisterGuide from "./components/RegisterGuide";

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
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 rounded-full animate-spin border-primary-500 border-t-transparent"></div>
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
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/contactus" element={<Contact />} />

      <Route path="/apform" element={<AppointmentForm />} />
      <Route path="/appointments" element={<AppointmentsPage />} />

      <Route path="/guideregister" element={<RegisterGuide />} />
      <Route path="/guidedashboard" element={<Guidedashboard />} />

      <Route path="/apform/:packageId" element={<AppointmentForm />} />
      <Route path="/appoiments" element={<AppointmentsPage />} />
      // In your App.js or routing file
      <Route path="/register-guide" element={<RegisterGuide />} />

      main

      <Route path="/appointments/edit/:id" element={<UpdateAppointmentPage />} />
      main
      <Route path="/addpackage" element={<PackageForm />} />
      <Route path="/packages" element={<Packages />} />
      <Route path="/packages/:packageId" element={<PackageView />} />
      <Route path="/edit-package/:packageId" element={<EditPackageForm />} />

      <Route path="/reviewform/:packageId" element={<ReviewForm />} />
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

      {/* 🆕 ADD THIS NEW ROUTE */}

      <Route
        path="/dashboard/admin/guide-scheduling"
        element={renderProtectedRoute(
          <DashboardLayout>
            <GuideRequestsTable />
          </DashboardLayout>,
          ["Admin"]
        )}
      />

      <Route
        path="/dashboard/admin/assign-guide"
        element={renderProtectedRoute(
          <DashboardLayout>
            <GuideAssignmentForm />
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
          <Chatbot />
          <Footer />
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
