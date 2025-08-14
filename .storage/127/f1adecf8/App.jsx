import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layout Component
import MainLayout from './components/layout/MainLayout';

// Auth Components
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';

// Home and Services Components
import HomePage from './components/home/HomePage';
import ServiceDetailPage from './components/services/ServiceDetailPage';
import ServicesPage from './components/services/ServicesPage';
import ServiceProvidersPage from './components/providers/ServiceProvidersPage';
import ProviderDetailPage from './components/providers/ProviderDetailPage';

// Service Requests Components
import RequestService from './components/service-requests/RequestService';
import MyRequestsPage from './components/service-requests/MyRequestsPage';
import RequestDetailPage from './components/service-requests/RequestDetailPage';

// User Components
import UserProfile from './components/user/UserProfile';
import NotificationsPage from './components/notifications/NotificationsPage';

// Provider Dashboard Components
import ProviderDashboard from './components/provider-dashboard/ProviderDashboard';
import ProviderServiceRequests from './components/provider-dashboard/ProviderServiceRequests';
import ManageServices from './components/provider-dashboard/ManageServices';
import ProviderProfile from './components/provider-dashboard/ProviderProfile';

// Admin Dashboard Components
import AdminDashboard from './components/admin-dashboard/AdminDashboard';
import ManageUsers from './components/admin-dashboard/ManageUsers';
import ManageProviders from './components/admin-dashboard/ManageProviders';
import ManageServiceCategories from './components/admin-dashboard/ManageServiceCategories';
import SystemSettings from './components/admin-dashboard/SystemSettings';

// Route Guards
const ProtectedRoute = ({ children }) => {
  // Check if token exists in localStorage
  const token = localStorage.getItem('token');
  
  if (!token) {
    // If not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  // Check if token exists and user has required role
  const token = localStorage.getItem('token');
  const userRolesString = localStorage.getItem('userRoles');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (!userRolesString) {
    return <Navigate to="/" replace />;
  }
  
  try {
    const userRoles = JSON.parse(userRolesString);
    const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
    
    return children;
  } catch (e) {
    console.error('Error parsing user roles:', e);
    return <Navigate to="/" replace />;
  }
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Main Layout Routes */}
            <Route path="/" element={<MainLayout />}>
              {/* Public Routes */}
              <Route index element={<HomePage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="services/:serviceId" element={<ServiceDetailPage />} />
              <Route path="providers" element={<ServiceProvidersPage />} />
              <Route path="providers/:providerId" element={<ProviderDetailPage />} />
              
              {/* Protected Routes - Regular User */}
              <Route path="services/:serviceId/request" element={
                <ProtectedRoute>
                  <RequestService />
                </ProtectedRoute>
              } />
              <Route path="my-requests" element={
                <ProtectedRoute>
                  <MyRequestsPage />
                </ProtectedRoute>
              } />
              <Route path="requests/:requestId" element={
                <ProtectedRoute>
                  <RequestDetailPage />
                </ProtectedRoute>
              } />
              <Route path="profile" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />
              <Route path="notifications" element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              } />
              
              {/* Provider Dashboard Routes */}
              <Route path="provider/dashboard" element={
                <RoleProtectedRoute allowedRoles={['ROLE_PROVIDER']}>
                  <ProviderDashboard />
                </RoleProtectedRoute>
              } />
              <Route path="provider/requests" element={
                <RoleProtectedRoute allowedRoles={['ROLE_PROVIDER']}>
                  <ProviderServiceRequests />
                </RoleProtectedRoute>
              } />
              <Route path="provider/services" element={
                <RoleProtectedRoute allowedRoles={['ROLE_PROVIDER']}>
                  <ManageServices />
                </RoleProtectedRoute>
              } />
              <Route path="provider/profile" element={
                <RoleProtectedRoute allowedRoles={['ROLE_PROVIDER']}>
                  <ProviderProfile />
                </RoleProtectedRoute>
              } />
              
              {/* Admin Dashboard Routes */}
              <Route path="admin/dashboard" element={
                <RoleProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <AdminDashboard />
                </RoleProtectedRoute>
              } />
              <Route path="admin/users" element={
                <RoleProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <ManageUsers />
                </RoleProtectedRoute>
              } />
              <Route path="admin/providers" element={
                <RoleProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <ManageProviders />
                </RoleProtectedRoute>
              } />
              <Route path="admin/categories" element={
                <RoleProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <ManageServiceCategories />
                </RoleProtectedRoute>
              } />
              <Route path="admin/settings" element={
                <RoleProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <SystemSettings />
                </RoleProtectedRoute>
              } />
              
              {/* 404 Route */}
              <Route path="*" element={
                <div className="container mx-auto px-4 py-16 text-center">
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h1>
                  <p className="text-lg text-gray-600 mb-8">The page you are looking for does not exist.</p>
                  <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Go Back Home
                  </a>
                </div>
              } />
            </Route>
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;