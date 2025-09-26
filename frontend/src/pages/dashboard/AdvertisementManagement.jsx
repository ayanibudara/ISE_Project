import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import api from "../../utils/api";
import {
  PlusIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import ConfirmationModal from "../../components/ui/ConfirmationModal";

const AdvertisementManagement = () => {
  const { authState } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    image: null,
  });

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // Fetch advertisements
  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/advertisements");

      if (response.data.success) {
        setAdvertisements(response.data.data);
      } else {
        showError("Failed to fetch advertisements");
      }
    } catch (error) {
      console.error("Error fetching advertisements:", error);
      showError("Error fetching advertisements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      showError("Please select an image");
      return;
    }

    try {
      setSubmitting(true);

      const submitData = new FormData();
      submitData.append("title", formData.title || "Advertisement");
      submitData.append("image", formData.image);

      const response = await api.post("/api/advertisements", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        showSuccess("Advertisement created successfully");
        setFormData({ title: "", image: null });
        setShowForm(false);
        fetchAdvertisements();

        // Reset file input
        const fileInput = document.getElementById("image-upload");
        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        showError(response.data.message || "Failed to create advertisement");
      }
    } catch (error) {
      console.error("Error creating advertisement:", error);
      showError(
        error.response?.data?.message || "Error creating advertisement"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = (advertisement) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Advertisement",
      message: `Are you sure you want to delete this advertisement? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const response = await api.delete(
            `/api/advertisements/${advertisement._id}`
          );

          if (response.data.success) {
            showSuccess("Advertisement deleted successfully");
            fetchAdvertisements();
          } else {
            showError("Failed to delete advertisement");
          }
        } catch (error) {
          console.error("Error deleting advertisement:", error);
          showError("Error deleting advertisement");
        } finally {
          setConfirmModal({ ...confirmModal, isOpen: false });
        }
      },
    });
  };

  // Handle toggle active status
  const handleToggleActive = async (advertisement) => {
    try {
      const response = await api.put(
        `/api/advertisements/${advertisement._id}`,
        {
          title: advertisement.title,
          isActive: !advertisement.isActive,
        }
      );

      if (response.data.success) {
        showSuccess(
          `Advertisement ${
            !advertisement.isActive ? "activated" : "deactivated"
          } successfully`
        );
        fetchAdvertisements();
      } else {
        showError("Failed to update advertisement status");
      }
    } catch (error) {
      console.error("Error updating advertisement:", error);
      showError("Error updating advertisement status");
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showError("Please select an image file");
        e.target.value = "";
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError("Image size should be less than 5MB");
        e.target.value = "";
        return;
      }

      setFormData({ ...formData, image: file });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Advertisement Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage advertisements that appear on the home page
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            New Advertisement
          </button>
        </div>
      </div>

      {/* Add New Advertisement Form */}
      {showForm && (
        <div className="mb-6 bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Add New Advertisement
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Title (Optional)
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter advertisement title"
              />
            </div>

            <div>
              <label
                htmlFor="image-upload"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Advertisement Image *
              </label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Supported formats: JPG, PNG, GIF, WEBP. Max size: 5MB
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-md transition-colors"
              >
                {submitting ? "Creating..." : "Create Advertisement"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ title: "", image: null });
                  const fileInput = document.getElementById("image-upload");
                  if (fileInput) fileInput.value = "";
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Advertisements List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : advertisements.length === 0 ? (
        <div className="text-center py-12">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No advertisements
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new advertisement.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advertisements.map((ad) => (
            <div
              key={ad._id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={`${api.defaults.baseURL}/uploads/${ad.image}`}
                  alt={ad.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {ad.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Created by: {ad.createdBy?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(ad.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ad.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {ad.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleToggleActive(ad)}
                    className={`p-2 rounded-md transition-colors ${
                      ad.isActive
                        ? "text-red-600 hover:bg-red-50"
                        : "text-green-600 hover:bg-green-50"
                    }`}
                    title={ad.isActive ? "Deactivate" : "Activate"}
                  >
                    {ad.isActive ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(ad)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />
    </div>
  );
};

export default AdvertisementManagement;
