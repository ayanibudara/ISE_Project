// src/pages/appointments/UpdateAppointmentPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import { ArrowLeft, Package, Users, FileText, Save, X, User } from 'lucide-react';

const UpdateAppointmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authState } = useAuth();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    membersCount: 1,
    selectedTier: 'Standard',
    note: '',
    needsGuide: false, // ← added
  });

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/appointments/${id}`);
        const app = response.data;

        if (app.userId?._id !== authState.user?._id && authState.user?.role !== 'Tourist') {
          setError('You are not authorized to edit this appointment.');
          setLoading(false);
          return;
        }

        setAppointment(app);
        setFormData({
          membersCount: app.membersCount || 1,
          selectedTier: app.selectedTier || 'Standard',
          note: app.note || '',
          needsGuide: app.needsGuide || false, // ← initialize from API
        });
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.message || 'Failed to load appointment');
        setLoading(false);
      }
    };

    if (id && authState.isAuthenticated) {
      fetchAppointment();
    }
  }, [id, authState]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'membersCount' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setError(null);

    try {
      const payload = {
        membersCount: formData.membersCount,
        selectedTier: formData.selectedTier,
        note: formData.note,
        needsGuide: formData.needsGuide, // ← include in update
      };

      await api.put(`/api/appointments/${id}`, payload);
      alert('Appointment updated successfully!');
      navigate('/appoiments');
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || 'Failed to update appointment');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 rounded-full border-blue-400/30"></div>
            <div className="absolute inset-0 border-4 rounded-full border-t-blue-400 animate-spin"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-blue-100">Loading appointment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="max-w-md p-8 text-center border shadow-2xl backdrop-blur-xl bg-white/10 border-white/20 rounded-2xl">
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-red-500/20">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="mt-6 text-2xl font-bold text-white">Error</h3>
          <p className="mt-3 text-blue-100">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 mt-6 font-medium text-white transition-all bg-blue-600 shadow-lg rounded-xl hover:bg-blue-500 hover:scale-105 shadow-blue-500/30"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Package display (unchanged)
  const packageName = appointment?.packageId?.packageName || 'Unknown Package';
  const packageTiers = appointment?.packageId?.packages?.map(p => p.packageType) || ['Standard', 'Premium', 'VIP'];

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="mb-6 overflow-hidden border shadow-2xl backdrop-blur-xl bg-gradient-to-r from-blue-600/80 to-indigo-700/80 border-white/20 rounded-2xl">
          <div className="p-6 lg:p-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 mb-4 transition-all text-white/80 hover:text-white hover:gap-3"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Appointments</span>
            </button>
            <h1 className="text-3xl font-bold text-white lg:text-4xl">Update Appointment</h1>
            <div className="flex items-center gap-2 mt-3">
              <Package className="w-5 h-5 text-blue-200" />
              <p className="text-lg text-blue-100">
                Package: <span className="font-semibold text-white">{packageName}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="overflow-hidden border shadow-2xl backdrop-blur-xl bg-white/10 border-white/20 rounded-2xl">
          <div className="grid gap-6 p-6 lg:p-8 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Package Tier */}
              <div className="p-6 transition-all border rounded-xl bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20">
                <label className="flex items-center gap-2 mb-3 text-sm font-semibold tracking-wide text-blue-200 uppercase">
                  <Package className="w-5 h-5" />
                  Package Tier
                </label>
                <select
                  name="selectedTier"
                  value={formData.selectedTier}
                  onChange={handleChange}
                  className="w-full p-4 text-white transition-all border rounded-xl bg-white/5 border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white/10 hover:bg-white/10 disabled:opacity-50"
                  disabled={saving}
                >
                  {packageTiers.map((tier) => (
                    <option key={tier} value={tier} className="text-gray-900 bg-white">
                      {tier}
                    </option>
                  ))}
                </select>
              </div>

              {/* Members Count */}
              <div className="p-6 transition-all border rounded-xl bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20">
                <label className="flex items-center gap-2 mb-3 text-sm font-semibold tracking-wide text-blue-200 uppercase">
                  <Users className="w-5 h-5" />
                  Number of Members
                </label>
                <input
                  type="number"
                  name="membersCount"
                  min="1"
                  max="20"
                  value={formData.membersCount}
                  onChange={handleChange}
                  className="w-full p-4 text-white transition-all border rounded-xl bg-white/5 border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white/10 hover:bg-white/10 disabled:opacity-50"
                  disabled={saving}
                />
              </div>

              {/* Needs Guide Toggle */}
              <div className="p-6 transition-all border rounded-xl bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20">
                <label className="flex items-start gap-3 cursor-pointer">
                  <div className="relative mt-1">
                    <input
                      type="checkbox"
                      name="needsGuide"
                      checked={formData.needsGuide}
                      onChange={handleChange}
                      className="sr-only"
                      disabled={saving}
                    />
                    <div
                      className={`block w-12 h-6 rounded-full transition-colors ${
                        formData.needsGuide ? 'bg-blue-500' : 'bg-gray-600'
                      }`}
                    ></div>
                    <div
                      className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                        formData.needsGuide ? 'transform translate-x-6' : ''
                      }`}
                    ></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-200" />
                      <span className="text-sm font-semibold tracking-wide text-blue-200 uppercase">
                        Requires Tour Guide
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-blue-100">
                      {formData.needsGuide
                        ? 'A local guide will accompany your group.'
                        : 'No guide needed for this tour.'}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="h-full p-6 transition-all border rounded-xl bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20">
                <label className="flex items-center gap-2 mb-3 text-sm font-semibold tracking-wide text-blue-200 uppercase">
                  <FileText className="w-5 h-5" />
                  Special Notes (Optional)
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows="8"
                  className="w-full p-4 text-white transition-all border resize-none rounded-xl bg-white/5 border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white/10 hover:bg-white/10 disabled:opacity-50"
                  placeholder="e.g., Dietary restrictions, accessibility needs..."
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mx-6 mb-6 lg:mx-8">
              <div className="p-4 border rounded-xl bg-red-500/10 border-red-500/30">
                <p className="font-medium text-red-300">{error}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 p-6 border-t sm:flex-row lg:p-8 bg-white/5 border-white/10">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-4 font-semibold text-white transition-all border rounded-xl bg-white/10 border-white/20 hover:bg-white/20 hover:scale-105 disabled:opacity-50"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 px-8 py-4 font-semibold text-white transition-all shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-500 hover:to-indigo-500 hover:scale-105 disabled:opacity-50 shadow-blue-500/30"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAppointmentPage;