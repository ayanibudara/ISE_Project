import { useState } from "react";
import { Star, Send, User, MessageCircle, Sparkles } from "lucide-react";

export default function ReviewForm({ onReviewAdded = () => {} }) {
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSubmitting(true);
    
    const review = { userName, message, rating };
    
    try {
      // Replace this with your actual API call
      const res = await fetch("http://localhost:5000/api/review/add", {     
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });
      
      if (!res.ok) throw new Error("Failed to submit review");
      
      const data = await res.json();
      onReviewAdded(data); // update list
      
      setIsSuccess(true);
      setTimeout(() => {
        setUserName("");
        setMessage("");
        setRating(5);
        setIsSuccess(false);
      }, 2000);
      
    } catch (error) {
      console.error(error.message);
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

  if (isSuccess) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 backdrop-blur-sm border border-green-200/50 shadow-2xl rounded-3xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h3>
          <p className="text-green-600">Your review has been submitted successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Share Your Experience
          </h1>
          <p className="text-gray-600 text-lg">We'd love to hear your thoughts and feedback</p>
        </div>

        {/* Main Form */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-2"></div>
          
          <div className="p-6 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Name Input */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    Your Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl 
                               focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100
                               transition-all duration-300 placeholder-gray-400 text-gray-800
                               group-hover:border-gray-300"
                      required
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Rating */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-100">
                  <StarRating />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Message Input */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-purple-500" />
                    Your Review
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
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 lg:mt-12 flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 
                         hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl 
                         shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         min-w-[200px] flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    Submit Review
                  </>
                )}
                
                {/* Button glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-400 
                              opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Your feedback helps us improve our services</p>
        </div>
      </div>
    </div>
  );
}