import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to view your profile');
        navigate('/login');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          toast.error('Session expired. Please log in again.');
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      console.log('Profile data fetched: ', data);

      setUser(data);
      setFormData({ name: data.name, email: data.email, password: '' });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      toast.error('Failed to fetch profile');
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No token found. Please login.');
        navigate('/login');
        return;
      }

      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/profile`,
        { name: formData.name, email: formData.email, password: formData.password },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setUser(data);
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.error('Session expired. Please log in again.');
        navigate('/login');
        return;
      }
      toast.error('Failed to update profile');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]); // Add navigate to dependencies

  if (loading) {
    return <div className="text-center mt-20 text-base text-gray-600">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center mt-20 text-base text-gray-600">No profile data available.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-indigo-700">DriveEasy</span>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate('/user/dashboard')}
              className="text-indigo-700 hover:text-indigo-800 font-medium transition-colors duration-200"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Body */}
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
            My Profile
          </h2>

          {editMode ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-gray-600 font-semibold w-32">Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-700"
                  required
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="text-gray-600 font-semibold w-32">Email:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-700"
                  required
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="text-gray-600 font-semibold w-32">Password:</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-700"
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-700 text-white px-6 py-2 rounded-lg hover:bg-indigo-800 transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-600 font-semibold w-32">Name:</span>
                <span className="text-gray-800">{user.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-600 font-semibold w-32">Email:</span>
                <span className="text-gray-800">{user.email}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-600 font-semibold w-32">Role:</span>
                <span className="text-gray-800 capitalize">{user.role}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-600 font-semibold w-32">Verified:</span>
                <span className="text-gray-800">{user.isEmailVerified ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-indigo-700 text-white px-6 py-2 rounded-lg hover:bg-indigo-800 transition-colors duration-200"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
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
};

export default Profile;