import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

function Checkout() {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if booking details are passed via state
    if (location.state) {
      setBookingDetails({
        vehicle: location.state.vehicle,
        startDate: location.state.fromDate,
        endDate: location.state.toDate,
        totalPrice: location.state.totalAmount,
      });
      setLoading(false);
    } else {
      // Fallback: If no state is passed, redirect to dashboard or show error
      setLoading(false);
    }
  }, [location.state]);

  const handlePayment = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          vehicle: bookingDetails.vehicle,
          fromDate: bookingDetails.startDate,
          toDate: bookingDetails.endDate,
          totalAmount: bookingDetails.totalPrice,
        }),
      });

      const session = await response.json();

      if (session.id) {
        localStorage.setItem('vehicleId', bookingDetails.vehicle._id);
        localStorage.setItem('fromDate', bookingDetails.startDate);
        localStorage.setItem('toDate', bookingDetails.endDate);
        localStorage.setItem('totalAmount', bookingDetails.totalPrice);

        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
        await stripe.redirectToCheckout({ sessionId: session.id });
      } else {
        console.error('Failed to create Stripe session:', session);
        alert('Failed to create payment session. Please try again.');
      }
    } catch (error) {
      console.error('Error during payment:', error);
      alert('An error occurred during payment. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-xl text-gray-600">Loading booking details...</div>;
  }

  if (!bookingDetails) {
    return (
      <div className="text-center mt-20 text-xl text-gray-600">
        No booking details found.
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
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-4 sm:mb-0">
            Checkout
          </h2>
          <button
            onClick={() => navigate('/user/dashboard')}
            className="bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-800 transition-colors duration-200"
          >
            Go to Dashboard
          </button>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-700 w-32">Vehicle:</span>
              <span className="text-gray-600 text-base">
                {bookingDetails.vehicle.make} {bookingDetails.vehicle.model}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-700 w-32">Total Price:</span>
              <span className="text-gray-600 text-base">
                ₹{parseFloat(bookingDetails.totalPrice).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-700 w-32">Booking Dates:</span>
              <span className="text-gray-600 text-base">
                {new Date(bookingDetails.startDate).toLocaleDateString()} to{' '}
                {new Date(bookingDetails.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          <button
            onClick={handlePayment}
            className="mt-6 w-full bg-indigo-700 text-white py-3 rounded-lg font-semibold hover:bg-indigo-800 transition-colors duration-200"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
