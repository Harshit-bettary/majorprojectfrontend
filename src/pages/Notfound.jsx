import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="text-center text-white">
        <h1 className="text-6xl font-extrabold mb-4 drop-shadow-lg">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-lg mb-6">
          Oops! The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="bg-yellow-400 text-gray-800 py-3 px-6 rounded-full font-semibold shadow-lg hover:bg-yellow-500 hover:shadow-xl transition duration-300"
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;