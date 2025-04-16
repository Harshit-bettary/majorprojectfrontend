import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AddReview from '../../components/AddReview';
import VehicleReviews from '../../components/VehicleReviews';

function VehicleDetails() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/vehicles/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch vehicle details');
        }
        return response.json();
      })
      .then((data) => {
        setVehicle(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching vehicle details:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="text-center mt-20 text-xl text-gray-600">Loading vehicle details...</div>;
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
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-4 sm:mb-0">
            {vehicle.make} {vehicle.model}
          </h2>
          <button
            onClick={() => navigate('/vehicles')}
            className="bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-800 transition-colors duration-200"
          >
            Back to Vehicles
          </button>
        </div>

        {/* Vehicle Details Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
          {/* Vehicle Image */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src={vehicle.images ? vehicle.images[0] : 'https://via.placeholder.com/400'}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>

          {/* Vehicle Details */}
          <div className="md:w-1/2 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {vehicle.description || 'No description available for this vehicle.'}
              </h3>
              <p className="text-base text-gray-600 mb-4">
                Price per day:{' '}
                <span className="text-indigo-700 font-semibold">
                  ₹{vehicle.pricePerDay?.toFixed(2) || 'N/A'}
                </span>
              </p>
              {/* Additional Details */}
              <div className="space-y-1 text-gray-600 text-base mb-4">
                <p>Fuel: {vehicle.fuelType || 'N/A'}</p>
                <p>Transmission: {vehicle.transmission || 'N/A'}</p>
                <p>Seats: {vehicle.seats || 'N/A'}</p>
                <p>Location: {vehicle.location || 'N/A'}</p>
              </div>
            </div>
            <Link
              to={`/booking/${id}`}
              className="bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-800 transition-colors duration-200 text-center"
            >
              Book Now
            </Link>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-indigo-700 mb-6">Reviews</h3>
          {/* Display Reviews */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <VehicleReviews vehicleId={id} />
          </div>
          {/* Add Review Form */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h4 className="text-xl font-semibold text-gray-700 mb-4">Leave a Review</h4>
            <AddReview vehicleId={id} onReviewAdded={() => window.location.reload()} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetails;