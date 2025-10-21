import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PackageProviderDashboard = () => {
  const { authState } = useAuth();
  const { user } = authState;
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch provider's packages
  const fetchPackages = async (providerId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/packages/provider/${providerId}`);
      if (!response.ok) throw new Error('Failed to fetch packages');
      const data = await response.json();
      setPackages(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching packages:', error);
      setError('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const providerId = user?._id || user?.id;
    if (authState.isAuthenticated && providerId) {
      fetchPackages(providerId);
    } else {
      setLoading(false);
    }
  }, [authState.isAuthenticated, user]);

  const handleAddPackage = () => {
    navigate('/addpackage');
  };

  const handleEditPackage = (packageId) => {
    navigate(`/edit-package/${packageId}`);
  };

  // Navigate to appointments page
  const handleViewAppointments = () => {
    navigate('/appointments');
  };

  // Delete package
  const handleDeletePackage = async (packageId, packageName) => {
    if (!window.confirm(`Are you sure you want to delete "${packageName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      if (token && token !== "null") {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:5000/api/packages/${packageId}`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete package');

      setPackages(packages.filter(pkg => pkg._id !== packageId));
    } catch (error) {
      console.error('Error deleting package:', error);
      alert('Failed to delete package. Please try again.');
    }
  };

  // Generate PDF Report
  const handleGenerateReport = () => {
    if (packages.length === 0) {
      alert("No packages available to generate a report.");
      return;
    }

    // BOM character to fix Excel UTF-8 issue
    const BOM = "\uFEFF";

    const csvHeader = "ID,Package Name,Category,Province,Options & Prices\n";
    const csvRows = packages.map((pkg, idx) => {
      const options = pkg.packages?.map(p => `${p.packageType}: Rs.${p.price}`).join("; ");
      return `${idx + 1},"${pkg.packageName}","${pkg.category}","${pkg.province}","${options}"`;
    }).join("\n");

    const csvContent = BOM + csvHeader + csvRows;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "packages_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 mb-4 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-600">Loading your packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl px-6 py-8 mx-auto sm:px-8 lg:px-12">
        <div className="mb-8">
          <p className="text-slate-600">
            Welcome back, <span className="font-semibold text-slate-800">{user?.businessName || user?.firstName}</span>! Manage your services and bookings.
          </p>
        </div>

        {/* Total Packages Card */}
        <div className="mb-8">
          <div className="max-w-xs p-6 transition-all duration-300 border shadow-lg bg-white/80 backdrop-blur-sm border-white/30 rounded-2xl hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-700">Total Packages</h3>
                <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text">
                  {packages.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Card */}
        <div className="mb-8">
          <div className="flex flex-col items-start justify-between gap-4 p-6 border shadow-lg bg-white/80 backdrop-blur-sm border-white/30 rounded-2xl md:flex-row md:items-center">
            <h3 className="text-xl font-semibold text-slate-800">My Packages</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAddPackage}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-500/25"
              >
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-blue-700 to-blue-800 group-hover:opacity-100"></div>
                <div className="relative flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add Package</span>
                </div>
              </button>
              <button
                onClick={handleViewAppointments}
                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-purple-500/25"
              >
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-purple-700 to-purple-800 group-hover:opacity-100"></div>
                <div className="relative flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>View Appointments</span>
                </div>
              </button>
              <button
                onClick={handleGenerateReport}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Packages List */}
        {error && (
          <div className="px-4 py-3 mb-6 text-red-700 border border-red-200 rounded-lg bg-red-50">
            {error}
          </div>
        )}

        {packages.length === 0 ? (
          <div className="p-12 text-center border shadow-lg bg-white/80 backdrop-blur-sm border-white/30 rounded-2xl">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-700">No packages yet</h3>
            <p className="mb-6 text-slate-600">You haven't created any tour packages yet.</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleAddPackage}
                className="px-6 py-3 font-medium text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:shadow-xl"
              >
                Create Your First Package
              </button>
              <button
                onClick={handleViewAppointments}
                className="px-6 py-3 font-medium text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl hover:shadow-xl"
              >
                View Appointments
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <div key={pkg._id} className="p-6 transition-all duration-300 border shadow-lg bg-white/80 backdrop-blur-sm border-white/30 rounded-2xl hover:shadow-xl">
                <div className="mb-4">
                  {pkg.image ? (
                    <img
                      src={pkg.image}
                      alt={pkg.packageName}
                      className="object-cover w-full h-40 mb-4 rounded-lg"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-40 mb-4 rounded-lg bg-gradient-to-r from-slate-200 to-slate-300">
                      <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <h3 className="mb-2 text-lg font-bold text-slate-800">{pkg.packageName}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                      {pkg.category}
                    </span>
                    <span className="inline-block px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                      {pkg.province}
                    </span>
                  </div>
                </div>

                {/* Package Types Summary */}
                <div className="mb-4">
                  <p className="mb-2 text-sm font-medium text-slate-700">Package Options:</p>
                  <div className="space-y-1">
                    {pkg.packages?.slice(0, 2).map((p, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-slate-600">{p.packageType}</span>
                        <span className="font-medium text-green-600">Rs.{p.price}</span>
                      </div>
                    ))}
                    {pkg.packages?.length > 2 && (
                      <p className="text-xs text-slate-500">+{pkg.packages.length - 2} more options</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => handleEditPackage(pkg._id)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePackage(pkg._id, pkg.packageName)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:shadow-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageProviderDashboard;