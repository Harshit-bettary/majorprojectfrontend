import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/payments/payment-history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch payment history');
        }
        return res.json();
      })
      .then((data) => {
        // Check if data.bookings exists and is an array; otherwise, set to empty array
        const paymentData = Array.isArray(data.bookings)
          ? data.bookings.map((booking) => ({
            _id: booking._id || Date.now() + Math.random(), // Fallback _id if not present
            date: booking.bookingDate,
            amount: booking.totalPrice,
            method: 'Card', // Hardcoded as per backend logic; adjust if needed
            status: booking.paymentStatus,
            vehicle: booking.vehicle,
          }))
          : [];
        setPayments(paymentData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching payment history:', error);
        setError('Failed to load payment history. Please try again.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-xl text-gray-600">Loading payment history...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-xl text-red-500">
        {error}
        <button
          onClick={() => navigate('/user/dashboard')}
          className="mt-6 bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-800 transition-colors duration-200"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center mt-20 text-xl text-gray-600">
        No payment history found.
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
            Payment History
          </h2>
          <button
            onClick={() => navigate('/user/dashboard')}
            className="bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-800 transition-colors duration-200"
          >
            Go to Dashboard
          </button>
        </div>

        {/* Payments Container */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {payments.length === 0 ? (
            <p className="text-gray-600 text-base text-center">No payments found.</p>
          ) : (
            <div className="space-y-6">
              {payments.map((payment) => (
                <div
                  key={payment._id}
                  className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {payment.vehicle.make} {payment.vehicle.model}
                  </h3>
                  <p className="text-gray-600 text-base mb-1">
                    Payment Date: {new Date(payment.date).toLocaleDateString() || 'Invalid Date'}
                  </p>
                  <p className="text-gray-600 text-base mb-1">
                    Amount: ₹{parseFloat(payment.amount).toFixed(2)}
                  </p>
                  <p className="text-gray-600 text-base mb-1">
                    Payment Method: {payment.method}
                  </p>
                  <p
                    className={`text-base font-semibold mt-2 ${payment.status === 'Completed'
                        ? 'text-green-600'
                        : payment.status === 'Failed'
                          ? 'text-red-500'
                          : 'text-yellow-600'
                      }`}
                  >
                    Status: {payment.status}
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

export default PaymentHistory;