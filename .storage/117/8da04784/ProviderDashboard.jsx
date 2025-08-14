import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ServiceService from '../../services/ServiceService';
import ServiceRequestService from '../../services/ServiceRequestService';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingRequests: 0,
    activeRequests: 0,
    completedRequests: 0,
    totalServices: 0,
    totalEarnings: 0,
    averageRating: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch provider services
        const services = await ServiceService.getProviderServices();
        
        // Fetch service requests
        const requests = await ServiceRequestService.getProviderRequests();
        
        // Calculate stats
        const pendingRequests = requests.filter(req => req.status === 'PENDING').length;
        const activeRequests = requests.filter(req => req.status === 'ACCEPTED' || req.status === 'IN_PROGRESS').length;
        const completedRequests = requests.filter(req => req.status === 'COMPLETED').length;
        
        // Calculate total earnings (from completed requests)
        const totalEarnings = requests
          .filter(req => req.status === 'COMPLETED')
          .reduce((sum, req) => sum + req.totalAmount, 0);
        
        // Calculate average rating
        const ratingsSum = services.reduce((sum, service) => {
          return sum + (service.averageRating || 0);
        }, 0);
        const averageRating = services.length > 0 ? ratingsSum / services.length : 0;
        
        // Set stats
        setStats({
          pendingRequests,
          activeRequests,
          completedRequests,
          totalServices: services.length,
          totalEarnings,
          averageRating
        });
        
        // Get most recent 5 requests
        const sortedRequests = [...requests].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        ).slice(0, 5);
        
        setRecentRequests(sortedRequests);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Provider Dashboard</h1>
        <div>
          <Link 
            to="/provider/services/new" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Add New Service
          </Link>
        </div>
      </div>
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center">
          <div className="mr-6">
            <div className="h-16 w-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Welcome back, {user?.name || 'Provider'}</h2>
            <p className="text-blue-100">Here's what's happening with your services today.</p>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Pending Requests</h3>
              <p className="text-3xl font-bold text-gray-800">{stats.pendingRequests}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/provider/requests?status=PENDING" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View all requests &rarr;
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Active Requests</h3>
              <p className="text-3xl font-bold text-gray-800">{stats.activeRequests}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/provider/requests?status=ACTIVE" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View active requests &rarr;
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11V9a2 2 0 00-2-2m2 4v4a2 2 0 104 0v-1m-4-3H9m2 0h4m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Earnings</h3>
              <p className="text-3xl font-bold text-gray-800">{formatCurrency(stats.totalEarnings)}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/provider/earnings" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View earnings &rarr;
            </Link>
          </div>
        </div>
      </div>
      
      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-3 bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Performance Overview</h2>
          </div>
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <h3 className="text-gray-500 text-sm font-medium">Total Services</h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalServices}</p>
            </div>
            <div className="text-center">
              <h3 className="text-gray-500 text-sm font-medium">Average Rating</h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {stats.averageRating.toFixed(1)}
                <span className="text-yellow-500 ml-1">★</span>
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-gray-500 text-sm font-medium">Completed</h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.completedRequests}</p>
            </div>
            <div className="text-center">
              <h3 className="text-gray-500 text-sm font-medium">Completion Rate</h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {stats.completedRequests + stats.activeRequests > 0
                  ? ((stats.completedRequests / (stats.completedRequests + stats.activeRequests)) * 100).toFixed(0)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <Link to="/provider/services" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 rounded-md bg-blue-100 text-blue-600 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Manage Services</h3>
                  <p className="text-sm text-gray-500">Add, edit, or remove your services</p>
                </div>
              </Link>
              
              <Link to="/provider/requests" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 rounded-md bg-green-100 text-green-600 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">View Service Requests</h3>
                  <p className="text-sm text-gray-500">Manage customer requests</p>
                </div>
              </Link>
              
              <Link to="/provider/profile" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 rounded-md bg-purple-100 text-purple-600 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Edit Profile</h3>
                  <p className="text-sm text-gray-500">Update your provider information</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Service Requests */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Recent Service Requests</h2>
          <Link to="/provider/requests" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View all
          </Link>
        </div>
        {recentRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-gray-50">
                  <th className="p-4 font-semibold text-gray-600">Service</th>
                  <th className="p-4 font-semibold text-gray-600">Customer</th>
                  <th className="p-4 font-semibold text-gray-600">Date</th>
                  <th className="p-4 font-semibold text-gray-600">Amount</th>
                  <th className="p-4 font-semibold text-gray-600">Status</th>
                  <th className="p-4 font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{request.service?.name || 'Unnamed Service'}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 mr-3">
                          {request.user?.imageUrl ? (
                            <img
                              src={request.user.imageUrl}
                              alt={request.user.username}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        {request.user?.username || 'Anonymous'}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="p-4 font-medium">
                      {formatCurrency(request.totalAmount)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link 
                        to={`/provider/requests/${request.id}`} 
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No recent requests</h3>
            <p className="mt-2 text-gray-600 max-w-md mx-auto">
              You don't have any service requests yet. When customers request your services, they will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboard;