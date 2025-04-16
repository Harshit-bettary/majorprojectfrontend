import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);

  useEffect(() => {
    const confirmBooking = async () => {
      const sessionId = new URLSearchParams(location.search).get('session_id');
      const vehicleId = localStorage.getItem('vehicleId');
      const fromDate = localStorage.getItem('fromDate');
      const toDate = localStorage.getItem('toDate');
      const totalAmount = localStorage.getItem('totalAmount');

      // Validate required fields
      if (!sessionId || !vehicleId || !fromDate || !toDate || !totalAmount) {
        setError('Missing booking details. Please try booking again.');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/payments/confirm-booking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            sessionId,
            vehicleId,
            fromDate,
            toDate,
            totalAmount: parseFloat(totalAmount), // Ensure totalAmount is a number
          }),
        });

        const result = await response.json();
        if (response.ok) {
          alert('Booking confirmed successfully!');
          // Clear localStorage to prevent duplicate bookings
          localStorage.removeItem('vehicleId');
          localStorage.removeItem('fromDate');
          localStorage.removeItem('toDate');
          localStorage.removeItem('totalAmount');
          navigate('/user/dashboard');
        } else {
          console.error('Failed to confirm booking:', result.message);
          setError(result.message || 'Failed to confirm booking.');
          navigate('/checkout');
        }
      } catch (error) {
        console.error('Error confirming booking:', error);
        setError('An error occurred while confirming the booking.');
        navigate('/checkout');
      }
    };

    confirmBooking();
  }, [navigate, location]);

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 font-sans antialiased">
      <div className="container mx-auto max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          {error ? (
            <>
              <h2 className="text-3xl font-bold text-red-500 mb-4">Booking Failed</h2>
              <p className="text-gray-600 text-base mb-6">{error}</p>
              <button
                onClick={() => navigate('/checkout')}
                className="bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-800 transition-colors duration-200"
              >
                Try Again
              </button>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-indigo-700 mb-4">Processing Payment</h2>
              <p className="text-gray-600 text-base">Please wait while we confirm your booking...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;