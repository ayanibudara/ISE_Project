import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const PackageProviderDashboard = () => {
  const { authState } = useAuth();
  const { user } = authState;
  const navigate = useNavigate();

  const [totalPackages, setTotalPackages] = useState(0);

  // Fetch packages count
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(`/api/packages/provider/${user?._id}`);
        if (!response.ok) throw new Error('Failed to fetch packages');

        const data = await response.json();
        setTotalPackages(data.length); // assuming API returns an array of packages
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    if (user?._id) {
      fetchPackages();
    }
  }, [user]);

  const handleAddPackage = () => {
    navigate('/addpackage');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="px-6 py-8 sm:px-8 lg:px-12 max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-slate-600">
            Welcome back, <span className="font-semibold text-slate-800">{user?.businessName || user?.firstName}</span>! Manage your services and bookings.
          </p>
        </div>

        {/* Total Packages Card */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 max-w-xs">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-700">Total Packages</h3>
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  {totalPackages}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Card */}
        <div>
          <div className="bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-800">My Packages</h3>
              <button
                onClick={handleAddPackage}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add Package</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageProviderDashboard;