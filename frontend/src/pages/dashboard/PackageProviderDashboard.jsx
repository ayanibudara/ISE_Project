import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const PackageProviderDashboard = () => {
  const { authState } = useAuth();
  const { user } = authState;
  const navigate = useNavigate();
  const location = useLocation();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isDashboardActive, setIsDashboardActive] = useState(true);

// 👉 Paste the generateReport() function here

const generateReport = () => {
  // ✅ Calculate most popular package based on total bookings (VIP + Premium + Standard)
  if (!packages || packages.length === 0) {
    alert("No package data available to generate report.");
    return;
  }

  const getTotalBookings = (pkg) =>
    (pkg.tierBookingCounts?.VIP || 0) +
    (pkg.tierBookingCounts?.Premium || 0) +
    (pkg.tierBookingCounts?.Standard || 0);

  const mostPopularPackage = packages.reduce((prev, current) =>
    getTotalBookings(current) > getTotalBookings(prev) ? current : prev
  );

  const reportWindow = window.open("", "_blank");
  const reportContent = `
    <html>
      <head>
        <title>Package Provider Report</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 30px;
            background: #f9fafb;
            color: #333;
          }
          h1, h2, h3 {
            text-align: center;
            color: #1e40af;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 14px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }
          th {
            background: #2563eb;
            color: white;
          }
          tr:nth-child(even) {
            background: #f3f4f6;
          }

          /* Badge styling */
          .badge {
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
            color: white;
            font-weight: bold;
            display: inline-block;
            min-width: 45px;
            text-align: center;
          }
          .vip { background-color: #b91c1c; }
          .premium { background-color: #9333ea; }
          .standard { background-color: #2563eb; }

          .popular-section {
            margin-top: 40px;
            padding: 20px;
            border: 2px solid #2563eb;
            background: #eff6ff;
            border-radius: 12px;
          }
          .tier-badges {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 8px;
          }
        </style>
      </head>
      <body>
        <h1>Package Provider Report</h1>
        <h3>Generated on: ${new Date().toLocaleString()}</h3>

        <h2>All Packages</h2>
        <table>
          <thead>
            <tr>
              <th>Package Name</th>
              <th>Category</th>
              <th>Province</th>
              <th>VIP</th>
              <th>Premium</th>
              <th>Standard</th>
              <th>Total Bookings</th>
            </tr>
          </thead>
          <tbody>
            ${packages
              .map((pkg) => {
                const vip = pkg.tierBookingCounts?.VIP || 0;
                const premium = pkg.tierBookingCounts?.Premium || 0;
                const standard = pkg.tierBookingCounts?.Standard || 0;
                const total = vip + premium + standard;

                return `
                  <tr>
                    <td>${pkg.packageName || "N/A"}</td>
                    <td>${pkg.category || "N/A"}</td>
                    <td>${pkg.province || "N/A"}</td>
                    <td><span class="badge vip">${vip}</span></td>
                    <td><span class="badge premium">${premium}</span></td>
                    <td><span class="badge standard">${standard}</span></td>
                    <td><strong>${total}</strong></td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>

        <div class="popular-section">
          <h2>🌟 Most Popular Package</h2>
          ${
            mostPopularPackage
              ? `
                <p><strong>Name:</strong> ${mostPopularPackage.packageName}</p>
                <p><strong>Category:</strong> ${mostPopularPackage.category}</p>
                <p><strong>Province:</strong> ${mostPopularPackage.province}</p>
                <div class="tier-badges">
                  <span class="badge vip">VIP: ${mostPopularPackage.tierBookingCounts?.VIP || 0}</span>
                  <span class="badge premium">Premium: ${mostPopularPackage.tierBookingCounts?.Premium || 0}</span>
                  <span class="badge standard">Standard: ${mostPopularPackage.tierBookingCounts?.Standard || 0}</span>
                </div>
                <p><strong>Total Bookings:</strong> ${getTotalBookings(mostPopularPackage)}</p>
              `
              : "<p>No packages available.</p>"
          }
        </div>
      </body>
    </html>
  `;

  reportWindow.document.write(reportContent);
  reportWindow.document.close();
  reportWindow.print();
};


//Then paste handleGenerateReport() function right below it

const handleGenerateReport = () => {
  setIsGeneratingReport(true);
  setTimeout(() => {
    generateReport();
    setIsGeneratingReport(false);
  }, 800);
};




  // Set dashboard as active when component mounts or location changes
  useEffect(() => {
    if (location.pathname === '/package-provider-dashboard' || location.pathname === '/dashboard') {
      setIsDashboardActive(true);
    }
  }, [location.pathname]);

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

  const handleViewAppointments = () => {
    navigate('/appointments');
  };

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


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-indigo-200 rounded-full animate-ping"></div>
            <div className="absolute inset-0 border-4 border-t-indigo-600 border-r-purple-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Loading your packages...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative px-6 py-8 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        {/* Header Section with Active Indicator */}
        <div className="mb-12">
          <div className="inline-block mb-4">
            <div
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl shadow-lg border transition-all duration-300 cursor-pointer ${
                isDashboardActive
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 border-blue-600 shadow-blue-500/50'
                  : 'bg-white/80 backdrop-blur-md border-white/20'
              }`}
              onClick={() => setIsDashboardActive(!isDashboardActive)}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 ${
                  isDashboardActive
                    ? 'bg-white/20 backdrop-blur-sm'
                    : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                }`}
              >
                <svg
                  className={`w-5 h-5 transition-colors ${isDashboardActive ? 'text-white' : 'text-white'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <div>
                <p
                  className={`text-sm font-medium transition-colors ${
                    isDashboardActive ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  Dashboard
                </p>
                <p
                  className={`text-lg font-bold transition-colors ${
                    isDashboardActive
                      ? 'text-white'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'
                  }`}
                >
                  {user?.businessName || user?.firstName}
                </p>
              </div>
              {isDashboardActive && (
                <div className="ml-2 flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-white/90">Active</span>
                </div>
              )}
            </div>
          </div>
          <p className="text-slate-600 text-lg">
            Welcome to PackageProviderDashboard, Manage your Package ease.
          </p>
        </div>

        {/* Stats & Actions Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Total Packages Card - Pearl Blue */}
          <div className="lg:col-span-1">
            <div className="group relative bg-white/90 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-600 mb-2">Total Packages</h3>
                <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {packages.length}
                </p>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-xl h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-600 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-slate-800">Quick Actions</h3>
                </div>
              </div>
              <div className="flex gap-4 flex-wrap">
                {/* Add Package - Blue */}
                <button
                  onClick={handleAddPackage}
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-500/90 via-blue-600/90 to-indigo-600/90 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400/50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-blue-700/90 to-indigo-700/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span className="text-lg">Add Package</span>
                  </div>
                </button>

                {/* View Appointments - Blue */}
                <button
                  onClick={handleViewAppointments}
                  className="group relative overflow-hidden bg-gradient-to-r from-sky-500/90 via-blue-500/90 to-cyan-500/90 text-white px-8 py-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-white/50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-600/90 via-blue-600/90 to-cyan-600/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-lg">View Appointments</span>
                  </div>
                </button>

                {/* Generate Report - Green */}
                <button
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
                  className="group relative overflow-hidden bg-gradient-to-r from-emerald-500/90 via-green-500/90 to-teal-500/90 text-white px-6 py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 via-green-600/90 to-teal-600/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="relative flex items-center gap-2">
                    {isGeneratingReport ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span className="text-sm">Generating...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="text-sm">Generate Report</span>
                      </>
                    )}
                  </div>
                  {isGeneratingReport && (
                    <div className="absolute inset-0 rounded-xl bg-white/20 animate-ping"></div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Packages Section */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">My Packages</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full"></div>
        </div>

        {packages.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-md border border-white/20 rounded-3xl p-16 text-center shadow-xl">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">No packages yet</h3>
            <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
              You haven't created any tour packages yet. Start building your offerings now!
            </p>
            <button
              onClick={handleAddPackage}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-400/90 via-blue-500/90 to-cyan-500/90 text-white px-10 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create Your First Package
            </button>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                className="group bg-white/90 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image Section */}
                <div className="relative overflow-hidden h-52">
                  {pkg.image ? (
                    <img
                      src={pkg.image}
                      alt={pkg.packageName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 flex items-center justify-center group-hover:from-blue-200 group-hover:via-cyan-200 group-hover:to-sky-200 transition-all duration-700">
                      <svg className="w-16 h-16 text-slate-500 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {pkg.packageName}
                  </h3>

                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 text-sm font-semibold rounded-full shadow-sm">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                      </svg>
                      {pkg.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-700 text-sm font-semibold rounded-full shadow-sm">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {pkg.province}
                    </span>
                  </div>

                  {/* Package Options */}
                  <div className="mb-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4">
                    <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      Package Options
                    </p>
                    <div className="space-y-2">
                      {pkg.packages?.slice(0, 2).map((p, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-sm bg-white rounded-lg px-3 py-2 shadow-sm"
                        >
                          <span className="text-slate-700 font-medium">{p.packageType}</span>
                          <span className="font-bold text-emerald-600">Rs.{p.price}</span>
                        </div>
                      ))}
                      {pkg.packages?.length > 2 && (
                        <p className="text-xs text-slate-500 font-medium pt-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {pkg.packages.length - 2} more options
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditPackage(pkg._id)}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg._id, pkg.packageName)}
                      className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default PackageProviderDashboard;