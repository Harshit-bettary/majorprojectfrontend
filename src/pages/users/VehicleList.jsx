import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function VehicleList() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/vehicles`)
      .then((res) => res.json())
      .then((data) => setVehicles(data));
  }, []);

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 font-sans antialiased">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-4 sm:mb-0">
            Available Vehicles
          </h2>
          <div className="flex space-x-4">
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-700"
            >
              <option>Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
            <button className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200 transition-colors duration-200">
              [Filters]
            </button>
          </div>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={vehicle.images}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-48 sm:h-64 md:h-72 object-cover"
                />
                {/* Rating */}
                <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 flex items-center shadow-sm">
                  <span className="text-amber-500 text-sm">
                    {vehicle.averageRating ? '★'.repeat(Math.round(vehicle.averageRating)) : 'No rating'}
                  </span>
                  <span className="text-gray-600 text-sm ml-1">
                    ({vehicle.averageRating ? vehicle.averageRating.toFixed(1) : 0})
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {vehicle.make} {vehicle.model}
                  </h3>
                  <p className="text-lg font-bold text-indigo-700">
                    {formatINR(vehicle.pricePerDay)}/day
                  </p>
                </div>

                {/* Vehicle Details */}
                <div className="space-y-1 text-gray-600 text-sm mb-4"></div>

                {/* Location */}
                <div className="text-gray-600 text-sm mb-4">
                  Location: {vehicle.location || 'N/A'}
                </div>

                {/* Buttons */}
                <div className="flex space-x-3">
                  <Link
                    to={`/vehicles/${vehicle._id}`}
                    className="flex-1 text-center border border-indigo-700 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors duration-200"
                  >
                    Details
                  </Link>
                  <Link
                    to={`/booking/${vehicle._id}`}
                    className="flex-1 text-center bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-800 transition-colors duration-200"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VehicleList;
