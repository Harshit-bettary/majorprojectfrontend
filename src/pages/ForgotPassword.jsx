import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('A password reset link has been sent to your email.');
        setEmail('');
      } else {
        throw new Error(data.message || 'Error requesting reset link.');
      }
    } catch (err) {
      setError(err.message || 'Error requesting reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-poppins">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-indigo-800 mb-4">
          Forgot Password
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your email to receive a password reset link.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500">
              <Mail className="w-5 h-5 text-gray-400 ml-3" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg focus:outline-none"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
          </div>
          {message && (
            <p className="text-green-600 text-center bg-green-50 p-2 rounded-lg">{message}</p>
          )}
          {error && (
            <p className="text-red-600 text-center bg-red-50 p-2 rounded-lg">{error}</p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-700 text-white rounded-lg font-semibold hover:bg-indigo-800 transition-colors duration-300 disabled:bg-indigo-400 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                Sending
                <span className="animate-pulse ml-1">...</span>
              </span>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          Remembered your password?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;