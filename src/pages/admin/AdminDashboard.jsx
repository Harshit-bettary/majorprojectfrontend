import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCar, FaUsers, FaCalendarCheck, FaDollarSign, FaStar, FaHeadset } from 'react-icons/fa';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    vehicles: 0,
    users: 0,
    bookings: 0,
    payments: 0,
    reviews: 0,
    inquiries: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user?.role?.toLowerCase();

  const checkResponse = async (res, name) => {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error(`${res.status === 401 ? 'Session expired' : 'Access denied'}. Please log in again.`);
      navigate('/login', { replace: true });
      throw new Error(`${name} fetch unauthorized (Status: ${res.status})`);
    }
    if (!res.ok) {
      throw new Error(`Failed to fetch ${name} (Status: ${res.status})`);
    }
    return res;
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found. Please log in.');
        navigate('/login', { replace: true });
        throw new Error('No token found');
      }

      const endpoints = [
        { name: 'vehicles', url: `${import.meta.env.VITE_API_URL}/admin/vehicles` },
        { name: 'users', url: `${import.meta.env.VITE_API_URL}/admin/users` },
        { name: 'bookings', url: `${import.meta.env.VITE_API_URL}/admin/bookings` },
        { name: 'payments', url: `${import.meta.env.VITE_API_URL}/admin/payments` },
        { name: 'inquiries', url: `${import.meta.env.VITE_API_URL}/admin/support` },
        { name: 'reviews', url: `${import.meta.env.VITE_API_URL}/admin/reviews` },
      ];

      const fetchPromises = endpoints.map(({ name, url }) =>
        fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => checkResponse(res, name))
          .then((res) => res.json())
          .catch((err) => {
            console.error(`Error fetching ${name}:`, err.message);
            return { name, error: err.message }; 
          })
      );

      const results = await Promise.all(fetchPromises);

      const newStats = { ...stats };
      const errors = [];

      results.forEach((result, index) => {
        const { name } = endpoints[index];
        if (result.error) {
          errors.push(`Failed to fetch ${name}: ${result.error}`);
        } else {
          newStats[name] = Array.isArray(result) ? result.length : 0;
        }
      });

      if (errors.length > 0) {
        setError(errors.join('; '));
      } else {
        setError(null);
      }

      setStats(newStats);
    } catch (err) {
      console.error('Unexpected error in fetchStats:', err);
      setError('An unexpected error occurred while fetching stats.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased">
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <span className="text-2xl font-bold text-indigo-700">DriveEasy Admin</span>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login', { replace: true });
            }}
            className="text-red-500 hover:text-red-600 font-medium transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center">Admin Dashboard</h2>
        {error && (
          <p className="text-red-500 text-center bg-red-100 py-2 rounded mb-6">{error}</p>
        )}
        {loading ? (
          <div className="text-center text-gray-600 text-lg font-medium">
            <svg
              className="animate-spin h-8 w-8 text-indigo-700 mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
              ></path>
            </svg>
            Loading stats...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              { icon: FaCar, label: 'Vehicles', count: stats.vehicles, route: '/admin/vehicles' },
              { icon: FaUsers, label: 'Users', count: stats.users, route: '/admin/users' },
              {
                icon: FaCalendarCheck,
                label: 'Bookings',
                count: stats.bookings,
                route: '/admin/bookings',
              },
              { icon: FaDollarSign, label: 'Payments', count: stats.payments, route: '/admin/payments' },
              { icon: FaStar, label: 'Reviews', count: stats.reviews, route: '/admin/reviews' },
              {
                icon: FaHeadset,
                label: 'Support Inquiries',
                count: stats.inquiries,
                route: '/admin/support',
              },
            ].map(({ icon: Icon, label, count, route }, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-transform duration-200"
              >
                <div className="flex justify-center mb-4">
                  <Icon className="text-4xl text-indigo-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{label}</h3>
                <p className="text-3xl font-bold text-indigo-700 mb-4">{count}</p>
                <button
                  onClick={() => navigate(route)}
                  className="bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-800 transition-colors duration-200"
                >
                  Manage {label}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="bg-indigo-700 text-white py-6">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="text-base mb-2">© 2025 DriveEasy. All rights reserved.</p>
          <div className="flex justify-center space-x-4 text-sm">
            <button
              onClick={() => navigate('/')}
              className="text-gray-200 hover:text-indigo-300 transition-colors duration-200"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/vehicles')}
              className="text-gray-200 hover:text-indigo-300 transition-colors duration-200"
            >
              Vehicles
            </button>
            <button
              onClick={() => navigate('/about')}
              className="text-gray-200 hover:text-indigo-300 transition-colors duration-200"
            >
              About Us
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="text-gray-200 hover:text-indigo-300 transition-colors duration-200"
            >
              Contact Us
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AdminDashboard;