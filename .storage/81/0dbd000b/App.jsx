import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ServiceDetails from './pages/ServiceDetails';
import RequestService from './pages/RequestService';
import ServiceProviderDashboard from './pages/ServiceProviderDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import AuthService from './services/AuthService';
import NotificationService from './services/NotificationService';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      await AuthService.checkAuthentication();
      setInitialized(true);
    };
    
    checkAuth();
  }, []);
  
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="flex flex-col min-h-screen font-poppins">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/services/:id" element={<ServiceDetails />} />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/request-service/:id" element={
                  <ProtectedRoute>
                    <RequestService />
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                
                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                } />
                
                <Route path="/provider/dashboard" element={
                  <ProtectedRoute roles={['ROLE_PROVIDER']}>
                    <ServiceProviderDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute roles={['ROLE_ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;