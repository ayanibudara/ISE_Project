import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Send, User, MessageCircle, Sparkles, ArrowLeft } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext"; // ✅ Import your AuthContext

export default function ReviewForm() {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { authState } = useAuth(); // ✅ Get user from context
  
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [packageName, setPackageName] = useState("");

  // ✅ Get user name from auth context (not JWT decoding)
  const userName = authState.user 
    ? `${authState.user.firstName} ${authState.user.lastName}`
    : "";

  // Redirect if not authenticated
  useEffect(() => {
    if (!authState.isAuthenticated && !authState.isLoading) {
      navigate("/login");
    }
  }, [authState.isAuthenticated, authState.isLoading, navigate]);

  // Fetch package name for UX
  useEffect(() => {
    if (!packageId || !authState.isAuthenticated) return;
    
    const fetchPackageName = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/packages/${packageId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setPackageName(data.packageName || "this package");
        }
      } catch (err) {
        console.error("Failed to fetch package name:", err);
      }
    };
    fetchPackageName();
  }, [packageId, authState.isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      alert("Please enter your review message.");
      return;
    }

    if (!packageId) {
      alert("Invalid package ID.");
      return;
    }

    setIsSubmitting(true);
    
    // ✅ EXACT required format (no userName in payload!)
    const reviewData = {
      packageId,
      message: message.trim(),
      rating
    };
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/review/add", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(reviewData),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to submit review");
      }
      
      setIsSuccess(true);
      setTimeout(() => {
        navigate(`/packages/${packageId}`);
      }, 2000);
      
    } catch (error) {
      console.error("Review error:", error);
      alert(error.message || "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = () => (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-sm font-medium text-gray-600 min-w-[50px]">Rating:</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="transition-all duration-200 hover:scale-110"
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setRating(star)}
            disabled={isSubmitting}
          >
            <Star
              className={`w-8 h-8 transition-all duration-200 ${
                star <= (hoveredRating || rating)
                  ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm'
                  : 'text-gray-300 hover:text-yellow-300'
              }`}
            />
          </button>
        ))}
      </div>
      <span className="ml-2 text-sm font-medium text-gray-500">
        {rating} star{rating !== 1 ? 's' : ''}
      </span>
    </div>
  );

  // Loading state
  if (authState.isLoading || !authState.user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="inline-block w-16 h-16 mb-4 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
          <p className="font-medium text-gray-600">Verifying your session...</p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="max-w-4xl p-4 mx-auto">
        <div className="p-8 text-center border shadow-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 backdrop-blur-sm border-green-200/50 rounded-3xl">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full shadow-lg bg-gradient-to-r from-green-400 to-emerald-500">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h3 className="mb-2 text-2xl font-bold text-green-800">Thank You!</h3>
          <p className="text-green-600">Your review has been submitted successfully.</p>
        </div>
      </div>
    );
  }

  if (!packageId) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-red-50 to-pink-100">
        <div className="max-w-md p-8 text-center bg-white border border-red-100 shadow-2xl rounded-3xl">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full">
            <Sparkles className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="mb-2 text-2xl font-bold text-gray-900">Invalid Request</h3>
          <p className="mb-6 text-gray-600">Package ID is missing.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center lg:mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4 font-semibold text-gray-600 transition-all duration-200 hover:text-blue-600 group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" />
            Back to Package
          </button>
          
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-transparent lg:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            Review {packageName}
          </h1>
          <p className="text-lg text-gray-600">
            Logged in as <span className="font-semibold text-blue-600">{userName}</span>
          </p>
        </div>

        {/* Main Form */}
        <div className="overflow-hidden border shadow-2xl bg-white/80 backdrop-blur-xl border-white/20 rounded-3xl">
          <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          <div className="p-6 lg:p-10">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Left Column - Auto-filled user info */}
                <div className="space-y-6">
                  {/* Auto-filled User Info */}
                  <div className="group">
                    <label className="flex items-center block gap-2 mb-3 text-sm font-semibold text-gray-700">
                      <User className="w-4 h-4 text-green-500" />
                      Your Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={userName}
                        readOnly
                        className="w-full px-4 py-4 font-medium text-green-800 border-2 border-green-200 cursor-not-allowed bg-green-50 rounded-2xl"
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="p-6 border border-gray-100 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl">
                    <StarRating />
                  </div>
                </div>

                {/* Right Column - Message */}
                <div className="space-y-6">
                  <div className="group">
                    <label className="flex items-center block gap-2 mb-3 text-sm font-semibold text-gray-700">
                      <MessageCircle className="w-4 h-4 text-purple-500" />
                      Your Review *
                    </label>
                    <div className="relative">
                      <textarea
                        placeholder="Share your detailed thoughts and experience..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl 
                                 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100
                                 transition-all duration-300 placeholder-gray-400 text-gray-800 resize-none
                                 group-hover:border-gray-300 min-h-[120px] lg:min-h-[180px]"
                        required
                      />
                      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 group-hover:opacity-100"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-8 lg:mt-12">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 
                           hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl 
                           shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                           min-w-[200px] flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                      Submit Review
                    </>
                  )}
                  
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-400 group-hover:opacity-20 blur"></div>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 text-sm text-center text-gray-500">
          <p>Your feedback helps us improve our services</p>
        </div>
      </div>
    </div>
  );
}