import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Dashboard() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [errorReviews, setErrorReviews] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [errorBookings, setErrorBookings] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!token || !user) {
      toast.error('No token or user found. Please log in.');
      navigate('/login', { replace: true });
      return;
    }
    setUserInfo(user); // Store user info for display
    console.log('User info:', user);
    fetchReviews(token);
    fetchBookings(token);
  }, [navigate]);

  const fetchReviews = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews/my`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Reviews API status:', response.status);
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please log in again.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login', { state: { message: 'Session expired. Please log in again.' } });
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch reviews');
      }
      const data = await response.json();
      console.log('Reviews data:', data);
      setReviews(data);
      setErrorReviews(null);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setErrorReviews('Unable to load reviews. Please try again later.');
      toast.error('Failed to load reviews: ' + error.message);
    } finally {
      setLoadingReviews(false);
    }
  };

  const fetchBookings = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/bookings/my`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Bookings API status:', response.status);
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please log in again.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login', { state: { message: 'Session expired. Please log in again.' } });
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch bookings');
      }
      const data = await response.json();
      console.log('Bookings data:', data);
      setBookings(data);
      setErrorBookings(null);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setErrorBookings('Unable to load bookings. Please try again later.');
      toast.error('Failed to load bookings: ' + error.message);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully.');
    navigate('/', { state: { message: 'You have been logged out successfully.' } });
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-indigo-700">DriveEasy</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => navigate('/user/profile')}
              className="text-gray-700 hover:text-indigo-700 font-medium transition-colors duration-200"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </div>
          <button className="md:hidden text-indigo-700" onClick={toggleMenu}>
            {isMenuOpen ? (
              <span className="text-2xl">✕</span>
            ) : (
              <span className="text-2xl">☰</span>
            )}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-md px-4 py-4">
            <div className="flex flex-col space-y-4 text-center">
              <button
                onClick={() => {
                  navigate('/user/profile');
                  toggleMenu();
                }}
                className="text-gray-700 hover:text-indigo-700 font-medium transition-colors duration-200"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="text-red-500 hover:text-red-600 font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Body */}
      <div className="container mx-auto px-4 sm:px-6 py-12">

        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-4">Welcome to DriveEasy</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Your hub for seamless vehicle rentals. Explore, book, and manage with ease.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/vehicles')}
              className="bg-indigo-700 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-800 transition-colors duration-200"
            >
              Explore Vehicles
            </button>
            <button
              onClick={() => navigate('/my-bookings')}
              className="bg-indigo-700 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-800 transition-colors duration-200"
            >
              Manage Bookings
            </button>
            <button
              onClick={() => navigate('/payment-history')}
              className="bg-indigo-700 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-800 transition-colors duration-200"
            >
              Payment History
            </button>
            <button
              onClick={() => navigate('/reviews')}
              className="bg-indigo-700 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-800 transition-colors duration-200"
            >
              Reviews
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 mt-8">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">My Reviews</h2>
          {loadingReviews ? (
            <p className="text-gray-600 text-center text-base font-bold">Loading reviews...</p>
          ) : errorReviews ? (
            <p className="text-red-500 text-center text-base font-bold">{errorReviews}</p>
          ) : reviews.length === 0 ? (
            <p className="text-blue-500 text-center text-lg font-bold bg-yellow-100 p-4 rounded">
              No reviews submitted yet. Try adding one!
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{review.vehicleName || 'Unknown Vehicle'}</h3>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 text-base mb-2">{review.comment || 'No comment'}</p>
                  <p className="text-gray-500 text-sm">
                    {review.date ? new Date(review.date).toLocaleDateString() : 'Unknown date'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking Status Section */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 mt-8">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">My Bookings</h2>
          {loadingBookings ? (
            <p className="text-gray-600 text-center text-base font-bold">Loading bookings...</p>
          ) : errorBookings ? (
            <p className="text-red-500 text-center text-base font-bold">{errorBookings}</p>
          ) : bookings.length === 0 ? (
            <p className="text-blue-500 text-center text-lg font-bold bg-yellow-100 p-4 rounded">
              No bookings found. Book a vehicle now!
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{booking.vehicleName || 'Unknown Vehicle'}</h3>
                  <p className="text-gray-600 text-base mb-1">
                    From: {booking.startDate ? new Date(booking.startDate).toLocaleDateString() : 'Unknown'}
                  </p>
                  <p className="text-gray-600 text-base mb-2">
                    To: {booking.endDate ? new Date(booking.endDate).toLocaleDateString() : 'Unknown'}
                  </p>
                  <p className="text-gray-600 text-base">
                    Status:{' '}
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                        booking.status === 'Confirmed'
                          ? 'bg-green-100 text-green-700'
                          : booking.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {booking.status || 'Unknown'}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
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

export default Dashboard;