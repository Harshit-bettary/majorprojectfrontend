import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCheck, FaTrash, FaStar } from 'react-icons/fa';

function AdminReviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/reviews`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          toast.error('Session expired. Please log in again.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login', { replace: true });
          return;
        }
        if (response.status === 403) {
          toast.error('You do not have permission to access this resource.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login', { replace: true });
          return;
        }
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const data = await response.json();
        console.log('Fetched reviews:', data);
        setReviews(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('An error occurred while fetching reviews.');
        setLoading(false);
        toast.error('Failed to load reviews.');
      }
    };

    fetchReviews();
  }, [navigate]);

  const approveReview = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/reviews/${id}/approve`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401 || response.status === 403) {
        toast.error('Session expired or unauthorized. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
        return;
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve review');
      }

      const { review } = await response.json();
      console.log('Approved review:', review);
      // Update review in state
      setReviews(reviews.map((r) => (r._id === id ? { ...r, isApproved: true } : r)));
      toast.success('Review approved successfully!');
    } catch (error) {
      console.error('Error approving review:', error);
      toast.error('Failed to approve review: ' + error.message);
    }
  };

  const deleteReview = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401 || response.status === 403) {
        toast.error('Session expired or unauthorized. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
        return;
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete review');
      }

      setReviews(reviews.filter((review) => review._id !== id));
      toast.success('Review deleted successfully!');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-indigo-700">DriveEasy Admin</span>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate('/admin')}
              className="text-indigo-700 hover:text-indigo-800 font-medium transition-colors duration-200"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login', { replace: true });
              }}
              className="text-red-500 hover:text-red-600 font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Body */}
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center">Review Moderation</h2>

        {error && (
          <p className="text-red-500 text-base mb-6 text-center bg-red-100 py-2 rounded-lg">
            {error}
          </p>
        )}

        {loading ? (
          <div className="text-center text-gray-600 text-lg font-medium">
            <svg
              className="animate-spin h-8 w-8 text-indigo-700 mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
              ></path>
            </svg>
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-gray-600 text-center text-lg font-medium">
            No reviews pending moderation.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {review.vehicleName || 'Unknown Vehicle'}
                </h3>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-xl ${
                        i < review.rating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-base mb-3">{review.comment}</p>
                <p className="text-gray-500 text-sm mb-4">
                  {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Unknown date'}
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  Status: {review.isApproved ? 'Approved' : 'Pending'}
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={() => approveReview(review._id)}
                    className={`flex items-center py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                      review.isApproved
                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                    aria-label={`Approve review for ${review.vehicleName || 'vehicle'}`}
                    disabled={review.isApproved}
                  >
                    <FaCheck className="mr-2" />
                    {review.isApproved ? 'Approved' : 'Approve'}
                  </button>
                  <button
                    onClick={() => deleteReview(review._id)}
                    className="flex items-center bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
                    aria-label={`Delete review for ${review.vehicleName || 'vehicle'}`}
                  >
                    <FaTrash className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-indigo-700 text-white py-6">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="text-base mb-2">© 2025 DriveEasy. All rights reserved.</p>
          <div className="flex justify-center space-x-4 text-sm">
            <button
              onClick={() => navigate('/')}
              className="text-gray-200 hover:text-indigo-300 transition-colors duration-200"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/vehicles')}
              className="text-gray-200 hover:text-indigo-300 transition-colors duration-200"
            >
              Vehicles
            </button>
            <button
              onClick={() => navigate('/about')}
              className="text-gray-200 hover:text-indigo-300 transition-colors duration-200"
            >
              About Us
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="text-gray-200 hover:text-indigo-300 transition-colors duration-200"
            >
              Contact Us
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AdminReviews;