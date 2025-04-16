import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Booking() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/vehicles/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch vehicle details');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Fetched Vehicle:', data);
        setVehicle(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching vehicle details:', error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (vehicle && fromDate && toDate) {
      const start = new Date(`${fromDate}T00:00:00`);
      const end = new Date(`${toDate}T00:00:00`);

      if (end >= start) {
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        const price = vehicle.pricePerDay || 0;
        const calculatedTotal = days * price;
        setTotalAmount(calculatedTotal);
        setButtonDisabled(calculatedTotal <= 0);
      } else {
        setTotalAmount(0);
        setButtonDisabled(true);
      }
    } else {
      setTotalAmount(0);
      setButtonDisabled(true);
    }
  }, [fromDate, toDate, vehicle]);

  const handleBooking = (e) => {
    e.preventDefault();

    if (!fromDate || !toDate) {
      alert('Please select both pick-up and drop-off dates.');
      return;
    }

    const start = new Date(`${fromDate}T00:00:00`);
    const end = new Date(`${toDate}T00:00:00`);
    if (end < start) {
      alert('Drop-off date must be after pick-up date.');
      return;
    }

    navigate('/checkout', {
      state: {
        vehicle,
        fromDate,
        toDate,
        totalAmount,
      },
    });
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (loading) {
    return <div className="text-center mt-20 text-xl text-gray-600">Loading booking details...</div>;
  }

  if (!vehicle) {
    return (
      <div className="text-center mt-20 text-xl text-red-500">
        Vehicle not found.
        <button
          onClick={() => navigate('/vehicles')}
          className="mt-6 bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-800 transition-colors duration-200"
        >
          Back to Vehicles
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 font-sans antialiased">
      <div className="container mx-auto max-w-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-4 sm:mb-0">
            Booking Details
          </h2>
          <button
            onClick={() => navigate('/vehicles')}
            className="bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-800 transition-colors duration-200"
          >
            Back to Vehicles
          </button>
        </div>

        {/* Vehicle Details Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-gray-600 text-base mb-2">{vehicle.description}</p>
            <p className="text-base font-semibold text-gray-800">
              ₹{vehicle.pricePerDay}/day
            </p>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleBooking} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Pick-up Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-700"
                value={fromDate}
                min={getTodayDate()}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Drop-off Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-700"
                value={toDate}
                min={fromDate || getTodayDate()}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Total Price</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                value={`₹${totalAmount.toFixed(2)}`}
                disabled
              />
            </div>
            <button
              type="submit"
              disabled={buttonDisabled}
              className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 ${
                buttonDisabled
                  ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                  : 'bg-indigo-700 text-white hover:bg-indigo-800'
              }`}
            >
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Booking;