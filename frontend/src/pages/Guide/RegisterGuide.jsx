import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext"; // import your AuthContext

export default function RegisterGuide() {
  const { authState } = useAuth(); // get logged-in user
  const userId = authState.user?._id; // assuming your user object has _id

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
  });

  const [availability, setAvailability] = useState([{ date: "", isAvailable: true }]);
  const [upcomingTours, setUpcomingTours] = useState([{ title: "", place: "", date: "" }]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvailabilityChange = (index, e) => {
    const newAvailability = [...availability];
    if (e.target.name === "isAvailable") {
      newAvailability[index][e.target.name] = e.target.checked;
    } else {
      newAvailability[index][e.target.name] = e.target.value;
    }
    setAvailability(newAvailability);
  };

  const addAvailability = () => setAvailability([...availability, { date: "", isAvailable: true }]);
  const removeAvailability = (index) => setAvailability([...availability.slice(0, index), ...availability.slice(index + 1)]);

  const handleTourChange = (index, e) => {
    const newTours = [...upcomingTours];
    newTours[index][e.target.name] = e.target.value;
    setUpcomingTours(newTours);
  };

  const addTour = () => setUpcomingTours([...upcomingTours, { title: "", place: "", date: "" }]);
  const removeTour = (index) => setUpcomingTours([...upcomingTours.slice(0, index), ...upcomingTours.slice(index + 1)]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage("You must be logged in to register as a guide.");
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData, userId, availability, upcomingTours };

      // Pass JWT automatically if you have Axios interceptors setup in api.js
      const response = await axios.post("http://localhost:5000/api/guides", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}` // optional if axios interceptor handles
        }
      });

      setMessage("Guide registered successfully!");
      setFormData({ firstName: "", lastName: "", age: "", email: "" });
      setAvailability([{ date: "", isAvailable: true }]);
      setUpcomingTours([{ title: "", place: "", date: "" }]);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Error registering guide");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-3xl p-8 bg-white shadow-lg rounded-xl">
        <h2 className="mb-6 text-2xl font-bold text-center">Register Guide</h2>
        {message && <p className="mb-4 text-center text-green-600">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name */}
          <div>
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="block w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="block w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min={18}
              className="block w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="block w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
            
          {/* Availability */}
          <div>
            <label className="block mb-2 text-gray-700">Availability</label>
            {availability.map((av, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="date"
                  name="date"
                  value={av.date}
                  onChange={(e) => handleAvailabilityChange(index, e)}
                  className="p-2 border border-gray-300 rounded-md"
                  required
                />
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={av.isAvailable}
                    onChange={(e) => handleAvailabilityChange(index, e)}
                    className="w-4 h-4"
                  />
                  Available
                </label>
                {availability.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAvailability(index)}
                    className="font-bold text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addAvailability} className="mt-2 font-semibold text-indigo-600">
              + Add Availability
            </button>
          </div>

          {/* Upcoming Tours */}
          <div>
            <label className="block mb-2 text-gray-700">Upcoming Tours</label>
            {upcomingTours.map((tour, index) => (
              <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={tour.title}
                  onChange={(e) => handleTourChange(index, e)}
                  required
                  className="p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  name="place"
                  placeholder="Place"
                  value={tour.place}
                  onChange={(e) => handleTourChange(index, e)}
                  required
                  className="p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="date"
                  name="date"
                  value={tour.date}
                  onChange={(e) => handleTourChange(index, e)}
                  required
                  className="p-2 border border-gray-300 rounded-md"
                />
                {upcomingTours.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTour(index)}
                    className="col-span-3 mt-1 font-bold text-left text-red-500"
                  >
                    Remove Tour
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addTour} className="mt-2 font-semibold text-indigo-600">
              + Add Tour
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-semibold text-white transition-colors bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            {loading ? "Registering..." : "Register Guide"}
          </button>
        </form>
      </div>
    </div>
  );
}
