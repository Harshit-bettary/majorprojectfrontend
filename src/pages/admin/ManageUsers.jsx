import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ManageUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUsers(data);
        } else {
          setError(data.message || 'Failed to fetch users');
        }
      } catch (err) {
        setError('An error occurred while fetching users');
      }
    };
    fetchUsers();
  }, []);

  const handleBlock = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${id}/block`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(users.map(u => u._id === id ? { ...u, isBlocked: true } : u));
      } else {
        setError(data.message || 'Failed to block user');
      }
    } catch (err) {
      setError('An error occurred while blocking the user');
    }
  };

  const handleUnblock = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${id}/unblock`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(users.map(u => u._id === id ? { ...u, isBlocked: false } : u));
      } else {
        setError(data.message || 'Failed to unblock user');
      }
    } catch (err) {
      setError('An error occurred while unblocking the user');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 font-sans antialiased">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-indigo-700 mb-8">Manage Users</h2>
        {error && <p className="text-red-500 text-base mb-4">{error}</p>}
        <div className="bg-white rounded-lg shadow-md p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-b">
                  <td className="py-2 px-4">{user.name}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">
                    {user.isBlocked ? (
                      <span className="text-red-500">Blocked</span>
                    ) : (
                      <span className="text-green-500">Active</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {!user.isBlocked && (
                      <button
                        onClick={() => handleBlock(user._id)}
                        className="bg-red-500 text-white py-1 px-3 rounded-lg mr-2 hover:bg-red-600"
                      >
                        Block
                      </button>
                    )}
                    {user.isBlocked && (
                      <button
                        onClick={() => handleUnblock(user._id)}
                        className="bg-green-500 text-white py-1 px-3 rounded-lg mr-2 hover:bg-green-600"
                      >
                        Unblock
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

export default ManageUsers;