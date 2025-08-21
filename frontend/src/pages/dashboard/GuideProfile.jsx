import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const GuideProfile = () => {
  const { authState } = useAuth();
  const { user } = authState;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    specialization: user?.specialization || '',
    experience: user?.experience || 0,
    profilePicture: user?.profilePicture || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    console.log('Updated profile data:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      specialization: user?.specialization || '',
      experience: user?.experience || 0,
      profilePicture: user?.profilePicture || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your guide profile information and settings.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Your personal information as a tour guide.
                </p>
              </div>
            </div>
            
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-6 gap-6">
                  {/* Profile Picture */}
                  <div className="col-span-6 sm:col-span-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Profile Picture
                    </label>
                    <div className="mt-1 flex items-center">
                      <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                        {user?.profilePicture ? (
                          <img className="h-full w-full rounded-full" src={user.profilePicture} alt="" />
                        ) : (
                          <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        )}
                      </span>
                      {isEditing && (
                        <button
                          type="button"
                          className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Change
                        </button>
                      )}
                    </div>
                  </div>

                  {/* First Name */}
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        !isEditing ? 'bg-gray-50 text-gray-500' : ''
                      }`}
                    />
                  </div>

                  {/* Last Name */}
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        !isEditing ? 'bg-gray-50 text-gray-500' : ''
                      }`}
                    />
                  </div>

                  {/* Email */}
                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        !isEditing ? 'bg-gray-50 text-gray-500' : ''
                      }`}
                    />
                  </div>

                  {/* Role */}
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <input
                      type="text"
                      value={user?.role || 'Guide'}
                      disabled
                      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50 text-gray-500"
                    />
                  </div>

                  {/* Specialization */}
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                      Specialization
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      id="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="e.g., Cultural Tours, Adventure Tours, History"
                      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        !isEditing ? 'bg-gray-50 text-gray-500' : ''
                      }`}
                    />
                  </div>

                  {/* Experience */}
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="experience"
                      id="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      min="0"
                      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        !isEditing ? 'bg-gray-50 text-gray-500' : ''
                      }`}
                    />
                  </div>

                  {/* Member Since */}
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Member Since
                    </label>
                    <input
                      type="text"
                      value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      disabled
                      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-5">
                  <div className="flex justify-end">
                    {!isEditing ? (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Guide Statistics */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Guide Statistics</h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-gray-50 overflow-hidden rounded-lg px-4 py-5">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Tours</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">24</dd>
            </div>
            <div className="bg-gray-50 overflow-hidden rounded-lg px-4 py-5">
              <dt className="text-sm font-medium text-gray-500 truncate">Average Rating</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">4.8</dd>
            </div>
            <div className="bg-gray-50 overflow-hidden rounded-lg px-4 py-5">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Reviews</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">156</dd>
            </div>
            <div className="bg-gray-50 overflow-hidden rounded-lg px-4 py-5">
              <dt className="text-sm font-medium text-gray-500 truncate">Tourists Guided</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">312</dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideProfile;
