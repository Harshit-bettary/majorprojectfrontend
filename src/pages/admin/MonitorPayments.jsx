import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MonitorPayments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/payments', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setPayments(data);
        } else {
          setError(data.message || 'Failed to fetch payments');
        }
      } catch (err) {
        setError('An error occurred while fetching payments');
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 font-sans antialiased">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-indigo-700 mb-8">Monitor Payments</h2>
        {error && <p className="text-red-500 text-base mb-4">{error}</p>}
        <div className="bg-white rounded-lg shadow-md p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4">Booking ID</th>
                <th className="py-2 px-4">User</th>
                <th className="py-2 px-4">Vehicle</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.bookingId} className="border-b">
                  <td className="py-2 px-4">{payment.bookingId}</td>
                  <td className="py-2 px-4">{payment.user.name}</td>
                  <td className="py-2 px-4">{payment.vehicle.make} {payment.vehicle.model}</td>
                  <td className="py-2 px-4">₹{payment.totalPrice.toFixed(2)}</td>
                  <td className="py-2 px-4">{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td className="py-2 px-4">
                    <span className="text-green-500">{payment.paymentStatus}</span>
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

export default MonitorPayments;