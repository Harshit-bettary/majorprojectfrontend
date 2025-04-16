import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields.');
      window.alert('Login unsuccessful: Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      console.log('Request body:', { email, password });
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Login successful!');
        window.alert('Login successful');

        const userRole = data.user.role ? data.user.role.toLowerCase() : 'user';
        console.log('User role:', userRole);

        if (userRole === 'admin') {
          navigate('/admin', { replace: true });
        } else if (userRole === 'user') {
          navigate('/user/dashboard', { replace: true });
        } else {
          toast.error('Invalid user role.');
          window.alert('Login unsuccessful: Invalid user role.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login', { replace: true });
        }
      } else {
        toast.error(data.message || 'Login failed. Please try again.');
        window.alert('Login unsuccessful: Invalid email or password.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('An error occurred. Please try again later.');
      window.alert('Login unsuccessful: An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-indigo-700">DriveEasy</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              to="/signup"
              className="text-indigo-700 hover:text-indigo-800 font-medium transition-colors duration-200"
              aria-label="Navigate to sign up page"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Body */}
      <div className="container mx-auto px-4 sm:px-6 py-12 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Welcome Back</h2>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-labelledby="login-title">
            <div>
              <label htmlFor="email" className="block text-gray-600 font-semibold mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                aria-required="true"
                aria-describedby="email-error"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-600 font-semibold mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                aria-required="true"
                aria-describedby="password-error"
              />
            </div>
            <div className="flex justify-between items-center">
              <Link
                to="/forgot-password"
                className="text-indigo-700 hover:text-indigo-800 text-sm transition-colors duration-200"
                aria-label="Navigate to forgot password page"
              >
                Forgot Password?
              </Link>
              <button
                type="submit"
                disabled={loading}
                className={`w-1/2 bg-indigo-700 text-white py-2 rounded-lg font-semibold hover:bg-indigo-800 transition-colors duration-200 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-label={loading ? 'Logging in, please wait' : 'Log in to your account'}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
          <p className="text-center text-gray-600 mt-4">
            Don’t have an account?{' '}
            <Link
              to="/signup"
              className="text-indigo-700 hover:text-indigo-800 hover:underline"
              aria-label="Navigate to sign up page"
            >
              Sign up
            </Link>
          </p>
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
              aria-label="Navigate to home page"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/vehicles')}
              className="text-gray-200 hover:text-indigo-300 transition-colors duration-200"
              aria-label="Navigate to vehicles page"
            >
              Vehicles
            </button>
            <button
              onClick={() => navigate('/about')}
              className="text-gray-200 hover:text-indigo-300 transition-colors duration-200"
              aria-label="Navigate to about us page"
            >
              About Us
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="text-gray-200 hover:text-indigo-300 transition-colors duration-200"
              aria-label="Navigate to contact us page"
            >
              Contact Us
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Login;