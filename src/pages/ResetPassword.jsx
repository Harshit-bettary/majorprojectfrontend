import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);

  // Validate token on mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-reset-token/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Invalid or expired token');
        }
        setTokenValid(true);
      } catch (err) {
        setError(err.message || 'Invalid or expired reset link.');
        setTokenValid(false);
      }
    };
    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    // Password validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Password must include at least one uppercase letter and one number.');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset successful. Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        throw new Error(data.message || 'Error resetting password.');
      }
    } catch (err) {
      setError(err.message || 'Error resetting password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-poppins">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-indigo-800 mb-4">Invalid Link</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Link
            to="/forgot-password"
            className="inline-block bg-indigo-700 text-white py-2 px-6 rounded-lg font-semibold hover:bg-indigo-800 transition-colors duration-300"
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-poppins">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-indigo-800 mb-4">
          Reset Password
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your new password to reset your account.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500">
              <Lock className="w-5 h-5 text-gray-400 ml-3" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg focus:outline-none"
                placeholder="Enter new password"
                required
                disabled={loading}
              />
            </div>
          </div>
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500">
              <Lock className="w-5 h-5 text-gray-400 ml-3" />
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg focus:outline-none"
                placeholder="Confirm new password"
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
            disabled={loading || tokenValid === null}
          >
            {loading ? (
              <span className="flex items-center">
                Resetting
                <span className="animate-pulse ml-1">...</span>
              </span>
            ) : (
              'Reset Password'
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

export default ResetPassword;