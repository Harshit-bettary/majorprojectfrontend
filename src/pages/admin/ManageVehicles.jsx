import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ManageVehicles() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/vehicles', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setVehicles(data);
        } else {
          setError(data.message || 'Failed to fetch vehicles');
        }
      } catch (err) {
        setError('An error occurred while fetching vehicles');
      }
    };
    fetchVehicles();
  }, []);

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/vehicles/${id}/approve`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setVehicles(vehicles.map(v => v._id === id ? { ...v, isApproved: true } : v));
      } else {
        setError(data.message || 'Failed to approve vehicle');
      }
    } catch (err) {
      setError('An error occurred while approving the vehicle');
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/vehicles/${id}/reject`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setVehicles(vehicles.map(v => v._id === id ? { ...v, isApproved: false } : v));
      } else {
        setError(data.message || 'Failed to reject vehicle');
      }
    } catch (err) {
      setError('An error occurred while rejecting the vehicle');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 font-sans antialiased">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-indigo-700 mb-8">Manage Vehicles</h2>
        {error && <p className="text-red-500 text-base mb-4">{error}</p>}
        <div className="bg-white rounded-lg shadow-md p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4">Make</th>
                <th className="py-2 px-4">Model</th>
                <th className="py-2 px-4">Price/Day</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(vehicle => (
                <tr key={vehicle._id} className="border-b">
                  <td className="py-2 px-4">{vehicle.make}</td>
                  <td className="py-2 px-4">{vehicle.model}</td>
                  <td className="py-2 px-4">₹{vehicle.pricePerDay.toFixed(2)}</td>
                  <td className="py-2 px-4">
                    {vehicle.isApproved ? (
                      <span className="text-green-500">Approved</span>
                    ) : (
                      <span className="text-red-500">Pending/Rejected</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {!vehicle.isApproved && (
                      <button
                        onClick={() => handleApprove(vehicle._id)}
                        className="bg-indigo-700 text-white py-1 px-3 rounded-lg mr-2 hover:bg-indigo-800"
                      >
                        Approve
                      </button>
                    )}
                    {vehicle.isApproved && (
                      <button
                        onClick={() => handleReject(vehicle._id)}
                        className="bg-red-500 text-white py-1 px-3 rounded-lg mr-2 hover:bg-red-600"
                      >
                        Reject
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

export default ManageVehicles;