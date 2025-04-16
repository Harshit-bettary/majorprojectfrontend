import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ManageBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/bookings', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setBookings(data);
        } else {
          setError(data.message || 'Failed to fetch bookings');
        }
      } catch (err) {
        setError('An error occurred while fetching bookings');
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/bookings/${id}/cancel`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setBookings(bookings.map(b => b._id === id ? { ...b, status: 'Cancelled' } : b));
      } else {
        setError(data.message || 'Failed to cancel booking');
      }
    } catch (err) {
      setError('An error occurred while cancelling the booking');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 font-sans antialiased">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-indigo-700 mb-8">Manage Bookings</h2>
        {error && <p className="text-red-500 text-base mb-4">{error}</p>}
        <div className="bg-white rounded-lg shadow-md p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4">User</th>
                <th className="py-2 px-4">Vehicle</th>
                <th className="py-2 px-4">Start Date</th>
                <th className="py-2 px-4">End Date</th>
                <th className="py-2 px-4">Total Price</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id} className="border-b">
                  <td className="py-2 px-4">{booking.user.name}</td>
                  <td className="py-2 px-4">{booking.vehicle.make} {booking.vehicle.model}</td>
                  <td className="py-2 px-4">{new Date(booking.startDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4">{new Date(booking.endDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4">₹{booking.totalPrice.toFixed(2)}</td>
                  <td className="py-2 px-4">
                    {booking.status === 'Cancelled' ? (
                      <span className="text-red-500">Cancelled</span>
                    ) : (
                      <span className="text-green-500">{booking.status}</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {booking.status !== 'Cancelled' && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={() => navigate('/admin')}
          className="mt-6 bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-800 transition-colors duration-200"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default ManageBookings;