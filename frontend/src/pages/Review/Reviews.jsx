import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Reviews = () => {
  const { packageId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/review/package/${packageId}`
        );
        setReviews(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    };

    if (packageId) {
      fetchReviews();
    }
  }, [packageId]);

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );

  

  if (!reviews.length)
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md p-12 text-center border-2 border-gray-200 bg-gray-50 rounded-2xl">
          <svg
            className="w-20 h-20 mx-auto mb-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <p className="text-xl font-semibold text-gray-700">No reviews yet</p>
          <p className="mt-2 text-gray-500">Be the first to share your experience!</p>
        </div>
      </div>
    );

  const avgRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="p-8 mb-8 bg-white shadow-lg rounded-2xl">
          <h2 className="mb-2 text-3xl font-bold text-gray-800">Customer Reviews</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {renderStars(Math.round(avgRating))}
              <span className="text-2xl font-bold text-gray-800">{avgRating}</span>
            </div>
            <span className="text-gray-500">
              Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </span>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="p-6 transition-all duration-300 bg-white border-l-4 border-blue-500 shadow-md rounded-2xl hover:shadow-xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 text-xl font-bold text-white rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {review.userName}
                    </h4>
                    <div className="mt-1">{renderStars(review.rating)}</div>
                  </div>
                </div>
                <div className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-100 to-yellow-200">
                  <span className="text-sm font-bold text-yellow-800">
                    {review.rating}.0
                  </span>
                </div>
              </div>
              <p className="pl-16 leading-relaxed text-gray-700">{review.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;