import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';

import VehicleList from './pages/users/VehicleList';
import VehicleDetails from './pages/users/VehicleDetails';
import Booking from './pages/users/Booking';
import Checkout from './pages/users/Checkout';
import Profile from './pages/users/Profile';
import MyBookings from './pages/users/MyBookings';
import Dashboard from './pages/users/Dashboard'; 
import Support from './pages/users/Support';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRoute from './routes/AdminRoute';
import ManageVehicles from './pages/admin/ManageVehicles';
import ManageUsers from './pages/admin/ManageUsers';
import ManageBookings from './pages/admin/ManageBookings';
import MonitorPayments from './pages/admin/MonitorPayments';
import HandleSupport from './pages/admin/HandleSupport';
import AdminReviews from './pages/admin/AdminReviews';


import NotFound from './pages/Notfound';
import { AuthProvider } from './context/Authcontext';

import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from "./components/PublicRoute";

import PaymentSuccess from './pages/payments/PaymentSuccess';
import PaymentCancelled from './pages/payments/PaymentCancelled';
import PaymentHistory from './pages/payments/PaymentHistory';
import Reviews from './pages/users/Reviews';


function App() {
  return (
  
    <Router>
        <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

          {/*Forgot Password Pages*/}
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* User Pages */}
          <Route element={<ProtectedRoute allowedRole="user" />}>
          <Route path="/user/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="/vehicles" element={<VehicleList />} />
          <Route path="/vehicles/:id" element={<VehicleDetails />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/user/profile" element={<Profile />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/support" element={<Support />} />

          {/* Payment Pages */}
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancelled" element={<PaymentCancelled />} />
          <Route path="/payment-history" element={<PaymentHistory />} />


          {/* Admin Pages */}
          <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/vehicles" element={<ManageVehicles />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path ="admin/reviews" element={<AdminReviews/>}></Route>
          <Route path="/admin/bookings" element={<ManageBookings />} />
          <Route path="/admin/payments" element={<MonitorPayments />} />
          <Route path="/admin/support" element={<HandleSupport />} />
          </Route>

          
          {/* Not Found Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      </AuthProvider>
    </Router>
  
  );
}

export default App;