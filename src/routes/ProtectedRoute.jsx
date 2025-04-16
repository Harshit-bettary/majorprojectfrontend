import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

function ProtectedRoute({ allowedRole }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const userRole = user?.role?.toLowerCase();

  if (!token || !user) {
    toast.error('Please log in to access this page.');
    return <Navigate to="/login" replace />;
  }

  if (userRole === allowedRole) {
    return <Outlet />; 
  }

  if (userRole === 'admin') {
    toast.error('Admins cannot access user pages.');
    return <Navigate to="/admin" replace />;
  }

  if (userRole === 'user') {
    toast.error('You do not have permission to access admin pages.');
    return <Navigate to="/user/dashboard" replace />;
  }

  toast.error('Invalid user role.');
  return <Navigate to="/login" replace />;
}

export default ProtectedRoute;