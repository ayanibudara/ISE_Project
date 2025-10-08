import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const PackageProviderDashboard = () => {
  const { authState } = useAuth();
  const { user } = authState;
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch provider's packages
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/packages/provider/${user?._id}`);
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
    if (user?._id) {
      console.log("Fetching packages for provider ID:", user._id);
      fetchPackages();
    }else {
    console.log("No user or user._id available"); // 🔍
    setLoading(false);
  }
  }, [user]);

  const handleAddPackage = () => {
    navigate('/addpackage');
  };

  const handleEditPackage = (packageId) => {
    navigate(`/edit-package/${packageId}`);
  };

  const handleDeletePackage = async (packageId, packageName) => {
    if (!window.confirm(`Are you sure you want to delete "${packageName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/packages/${packageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete package');

      // Remove deleted package from state
      setPackages(packages.filter(pkg => pkg._id !== packageId));
    } catch (error) {
      console.error('Error deleting package:', error);
      alert('Failed to delete package. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Loading your packages...</p>
        </div>
      </div>
    );
  }

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
                  {packages.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Card */}
        <div className="mb-8">
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

        {/* Packages List */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {packages.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl p-12 text-center shadow-lg">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No packages yet</h3>
            <p className="text-slate-600 mb-6">You haven't created any tour packages yet.</p>
            <button
              onClick={handleAddPackage}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Create Your First Package
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <div key={pkg._id} className="bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="mb-4">
                  {pkg.image ? (
                    <img
                      src={pkg.image}
                      alt={pkg.packageName}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{pkg.packageName}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {pkg.category}
                    </span>
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      {pkg.province}
                    </span>
                  </div>
                </div>

                {/* Package Types Summary */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-slate-700 mb-2">Package Options:</p>
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
                    className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2 px-4 rounded-lg font-medium text-sm hover:shadow-md transition-all duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePackage(pkg._id, pkg.packageName)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg font-medium text-sm hover:shadow-md transition-all duration-200"
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