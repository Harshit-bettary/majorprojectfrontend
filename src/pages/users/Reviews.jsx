import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews/my`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-xl text-gray-600">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center mt-20 text-xl text-gray-600">
        No reviews found.
        <button
          onClick={() => navigate('/user/dashboard')}
          className="mt-6 bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-800 transition-colors duration-200"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 font-sans antialiased">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-4 sm:mb-0">
            My Reviews
          </h2>
          <button
            onClick={() => navigate('/user/dashboard')}
            className="bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-800 transition-colors duration-200"
          >
            Go to Dashboard
          </button>
        </div>

        {/* Reviews Container */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {reviews.length === 0 ? (
            <p className="text-gray-600 text-base text-center">No reviews submitted yet.</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {review.vehicle.make} {review.vehicle.model}
                  </h3>
                  <div className="flex items-center mb-2">
                    <span className="text-amber-500 text-base">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </span>
                    <span className="text-gray-600 text-sm ml-2">
                      ({review.rating}/5)
                    </span>
                  </div>
                  <p className="text-gray-600 text-base mb-2">{review.comment}</p>
                  <p className="text-gray-500 text-sm">
                    Submitted on: {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reviews;