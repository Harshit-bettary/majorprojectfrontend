import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [reviewData, setReviewData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/bookings/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch bookings');
        }
        return res.json();
      })
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      });
  }, []);

  const handleReviewSubmit = async (booking) => {
    const token = localStorage.getItem('token');
    const { comment, rating } = reviewData[booking._id] || {};

    if (!comment || !rating) {
      alert('Please enter both comment and rating.');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          vehicleId: booking.vehicle._id,
          comment,
          rating,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit review');
      alert('Review submitted successfully!');
      setReviewData((prev) => ({ ...prev, [booking._id]: { comment: '', rating: '' } }));
    } catch (err) {
      console.error('Review error:', err);
      alert('Error submitting review.');
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-xl text-gray-600">Loading your bookings...</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center mt-20 text-xl text-gray-600">
        You have no bookings yet.
        <button
          onClick={() => navigate('/user/dashboard')}
          className="mt-6 bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-800 transition-colors duration-200"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const currentDate = new Date();

  const currentBookings = bookings.filter(
    (booking) => new Date(booking.endDate) >= currentDate
  );
  const pastBookings = bookings.filter(
    (booking) => new Date(booking.endDate) < currentDate
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-700';
      case 'Completed':
        return 'bg-blue-100 text-blue-700';
      case 'Pending':
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 font-sans antialiased">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-4 sm:mb-0">
            My Bookings
          </h2>
          <button
            onClick={() => navigate('/user/dashboard')}
            className="bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-800 transition-colors duration-200"
          >
            Go to Dashboard
          </button>
        </div>

        {/* Current Bookings */}
        <h3 className="text-2xl font-bold text-indigo-700 mb-6">Current Bookings</h3>
        {currentBookings.length === 0 ? (
          <p className="text-gray-600 text-base mb-8">No current bookings.</p>
        ) : (
          <div className="space-y-6">
            {currentBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  {booking.vehicle.make} {booking.vehicle.model}
                </h4>
                <p className="text-gray-600 text-base mb-1">
                  Dates: {new Date(booking.startDate).toLocaleDateString()} to{' '}
                  {new Date(booking.endDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600 text-base mb-2">
                  Total Amount: ₹{booking.totalPrice}
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}
                >
                  {booking.status || 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Past Bookings */}
        <h3 className="text-2xl font-bold text-indigo-700 mt-12 mb-6">Past Bookings</h3>
        {pastBookings.length === 0 ? (
          <p className="text-gray-600 text-base mb-8">No past bookings.</p>
        ) : (
          <div className="space-y-6">
            {pastBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  {booking.vehicle.make} {booking.vehicle.model}
                </h4>
                <p className="text-gray-600 text-base mb-1">
                  Dates: {new Date(booking.startDate).toLocaleDateString()} to{' '}
                  {new Date(booking.endDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600 text-base mb-2">
                  Total Amount: ₹{booking.totalPrice}
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}
                >
                  {booking.status || 'Pending'}
                </span>

                {/* Review Form */}
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <h5 className="text-lg font-semibold text-gray-700 mb-3">Leave a Review</h5>
                  <textarea
                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-700"
                    rows={3}
                    placeholder="Write your review..."
                    value={reviewData[booking._id]?.comment || ''}
                    onChange={(e) =>
                      setReviewData((prev) => ({
                        ...prev,
                        [booking._id]: {
                          ...prev[booking._id],
                          comment: e.target.value,
                        },
                      }))
                    }
                  />
                  <div className="flex items-center space-x-3 mt-2">
                    <label className="text-gray-600 text-sm">Rating (1-5):</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      className="w-20 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-700"
                      placeholder="Rating"
                      value={reviewData[booking._id]?.rating || ''}
                      onChange={(e) =>
                        setReviewData((prev) => ({
                          ...prev,
                          [booking._id]: {
                            ...prev[booking._id],
                            rating: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <button
                    onClick={() => handleReviewSubmit(booking)}
                    className="mt-3 bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;