import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import userService from '../services/userService';
import api from '../services/api';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ShieldCheckIcon,
  StarIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const ProfileEdit = () => {
  const { authState, checkAuth, logout } = useAuth();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    role: ''
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);

  useEffect(() => {
    if (authState.user) {
      setProfileData({
        firstName: authState.user.firstName || '',
        lastName: authState.user.lastName || '',
        email: authState.user.email || '',
        mobile: authState.user.mobile || '',
        role: authState.user.role || ''
      });
      
      if (authState.user.profilePicture) {
        setProfilePicturePreview(`${api.defaults.baseURL}${authState.user.profilePicture}`);
      }
    }
  }, [authState.user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicturePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      const formData = new FormData();
      Object.keys(profileData).forEach(key => {
        if (profileData[key] !== '' && profileData[key] !== null) {
          formData.append(key, profileData[key]);
        }
      });
      
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      await userService.updateProfile(formData);
      await checkAuth(); // Refresh user data
      
      setIsEditing(false);
      setProfilePicture(null);
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast(error.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfilePicture(null);
    // Reset form data to original values
    if (authState.user) {
      setProfileData({
        firstName: authState.user.firstName || '',
        lastName: authState.user.lastName || '',
        email: authState.user.email || '',
        mobile: authState.user.mobile || '',
        role: authState.user.role || ''
      });
      
      if (authState.user.profilePicture) {
        setProfilePicturePreview(`${api.defaults.baseURL}${authState.user.profilePicture}`);
      }
    }
  };

  const handleDeleteProfile = async () => {
    try {
      setIsDeleting(true);
      await userService.deleteProfile();
      showToast('Profile deleted successfully', 'success');
      
      // Give time for toast to show
      setTimeout(async () => {
        // Logout user after successful deletion
        await logout();
        // Force page refresh to ensure clean state
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error deleting profile:', error);
      showToast(error.response?.data?.message || 'Failed to delete profile', 'error');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!authState.user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600 text-lg">Manage your personal information and preferences</p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Profile Header with Gradient Background */}
          <div className="relative bg-gradient-to-r from-emerald-500 via-emerald-600 to-blue-600 px-8 py-12">
            <div className="absolute inset-0 bg-black/10"></div>
            
            {/* Edit/Save Buttons */}
            <div className="relative flex justify-end mb-4">
              {!isEditing ? (
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center px-6 py-3 bg-red-500/20 backdrop-blur-sm text-white rounded-xl hover:bg-red-500/30 transition-all duration-300 border border-red-300/30 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <TrashIcon className="w-5 h-5 mr-2" />
                    Delete Profile
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <PencilIcon className="w-5 h-5 mr-2" />
                    Edit Profile
                  </button>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                  >
                    <CheckIcon className="w-5 h-5 mr-2" />
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <XMarkIcon className="w-5 h-5 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Profile Picture and Basic Info */}
            <div className="relative flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-8">
              {/* Profile Picture */}
              <div className="relative group">
                <div className="relative">
                  {profilePicturePreview ? (
                    <img
                      src={profilePicturePreview}
                      alt="Profile"
                      className="w-40 h-40 rounded-full object-cover border-6 border-white shadow-2xl group-hover:shadow-3xl transition-all duration-300"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-white/20 backdrop-blur-sm border-6 border-white shadow-2xl flex items-center justify-center group-hover:shadow-3xl transition-all duration-300">
                      <UserIcon className="w-20 h-20 text-white/70" />
                    </div>
                  )}
                  
                  {/* Upload Overlay */}
                  {isEditing && (
                    <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                      <label
                        htmlFor="profilePictureInput"
                        className="flex flex-col items-center text-white cursor-pointer"
                      >
                        <CameraIcon className="w-8 h-8 mb-2" />
                        <span className="text-sm font-medium">Change Photo</span>
                      </label>
                    </div>
                  )}
                  
                  {/* Camera Icon Badge */}
                  {isEditing && (
                    <label
                      htmlFor="profilePictureInput"
                      className="absolute bottom-2 right-2 bg-emerald-500 rounded-full p-3 cursor-pointer hover:bg-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 border-3 border-white"
                    >
                      <CameraIcon className="w-5 h-5 text-white" />
                    </label>
                  )}
                </div>
                
                <input
                  id="profilePictureInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* User Info */}
              <div className="text-center md:text-left text-white">
                <h2 className="text-3xl font-bold mb-2">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-3">
                  <ShieldCheckIcon className="w-5 h-5" />
                  <span className="text-lg font-medium capitalize bg-white/20 px-3 py-1 rounded-full">
                    {profileData.role}
                  </span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm">Profile Complete</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <UserIcon className="w-6 h-6 mr-2 text-emerald-600" />
                  Personal Information
                </h3>
                
                {/* First Name */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" />
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 ${
                        isEditing 
                          ? 'border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 bg-white hover:border-gray-300' 
                          : 'border-gray-100 bg-gray-50/50 cursor-not-allowed'
                      }`}
                      placeholder="Enter your first name"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" />
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 ${
                        isEditing 
                          ? 'border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 bg-white hover:border-gray-300' 
                          : 'border-gray-100 bg-gray-50/50 cursor-not-allowed'
                      }`}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <EnvelopeIcon className="w-6 h-6 mr-2 text-emerald-600" />
                  Contact Information
                </h3>
                
                {/* Email */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" />
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 ${
                        isEditing 
                          ? 'border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 bg-white hover:border-gray-300' 
                          : 'border-gray-100 bg-gray-50/50 cursor-not-allowed'
                      }`}
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" />
                    <input
                      type="tel"
                      name="mobile"
                      value={profileData.mobile}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 ${
                        isEditing 
                          ? 'border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 bg-white hover:border-gray-300' 
                          : 'border-gray-100 bg-gray-50/50 cursor-not-allowed'
                      }`}
                      placeholder="Enter your mobile number"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions for Mobile */}
            {isEditing && (
              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4 sm:justify-end lg:hidden">
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium disabled:opacity-50"
                >
                  Cancel Changes
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2 inline-block"></div>
                      Saving Changes...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheckIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Verified Account</h4>
            <p className="text-sm text-gray-600">Your account is verified and secure</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Profile Complete</h4>
            <p className="text-sm text-gray-600">100% profile completion</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <StarIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Premium Features</h4>
            <p className="text-sm text-gray-600">Access to all platform features</p>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delete Profile</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                  </div>
                </div>
                
                {/* Modal Content */}
                <div className="mb-6">
                  <p className="text-gray-700 mb-4">
                    Are you sure you want to delete your profile? This will permanently remove:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Your personal information</li>
                    <li>Profile picture</li>
                    <li>Account access</li>
                    <li>All associated data</li>
                  </ul>
                  <p className="text-red-600 text-sm font-medium mt-4">
                    This action is irreversible and cannot be undone.
                  </p>
                </div>
                
                {/* Modal Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteProfile}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 font-medium disabled:opacity-50 flex items-center justify-center"
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <TrashIcon className="w-4 h-4 mr-2" />
                        Delete Forever
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileEdit;
