import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import ServiceRequestService from '../../services/ServiceRequestService';

const ProviderServiceRequests = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'ALL');
  
  useEffect(() => {
    fetchRequests();
  }, [selectedStatus]);
  
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await ServiceRequestService.getProviderRequests();
      
      // Filter by status if needed
      let filteredData = [...data];
      if (selectedStatus !== 'ALL') {
        // For ACTIVE filter, include both ACCEPTED and IN_PROGRESS
        if (selectedStatus === 'ACTIVE') {
          filteredData = data.filter(
            req => req.status === 'ACCEPTED' || req.status === 'IN_PROGRESS'
          );
        } else {
          filteredData = data.filter(req => req.status === selectedStatus);
        }
      }
      
      // Sort by date (newest first)
      filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setRequests(filteredData);
    } catch (err) {
      console.error('Error fetching service requests:', err);
      setError('Failed to load service requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    navigate(`/provider/requests${status === 'ALL' ? '' : `?status=${status}`}`);
  };
  
  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      await ServiceRequestService.updateServiceRequestStatus(requestId, newStatus);
      // Update the request status in the UI without having to refetch
      setRequests(requests.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      ));
    } catch (err) {
      console.error('Error updating service request status:', err);
      alert('Failed to update request status. Please try again.');
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
  
  const getAvailableActions = (status) => {
    switch (status) {
      case 'PENDING':
        return [
          { value: 'ACCEPTED', label: 'Accept', className: 'bg-blue-600 hover:bg-blue-700' },
          { value: 'CANCELLED', label: 'Decline', className: 'bg-red-600 hover:bg-red-700' }
        ];
      case 'ACCEPTED':
        return [
          { value: 'IN_PROGRESS', label: 'Start Service', className: 'bg-purple-600 hover:bg-purple-700' },
          { value: 'CANCELLED', label: 'Cancel', className: 'bg-red-600 hover:bg-red-700' }
        ];
      case 'IN_PROGRESS':
        return [
          { value: 'COMPLETED', label: 'Complete', className: 'bg-green-600 hover:bg-green-700' },
          { value: 'CANCELLED', label: 'Cancel', className: 'bg-red-600 hover:bg-red-700' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Service Requests</h1>
        <p className="text-gray-600 mt-2">Manage and respond to service requests from your customers</p>
      </div>
      
      {/* Status Filter Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <div className="flex flex-wrap -mb-px">
          <button
            onClick={() => handleStatusChange('ALL')}
            className={`inline-block py-4 px-4 text-sm font-medium ${
              selectedStatus === 'ALL'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'
            }`}
          >
            All Requests
          </button>
          <button
            onClick={() => handleStatusChange('PENDING')}
            className={`inline-block py-4 px-4 text-sm font-medium ${
              selectedStatus === 'PENDING'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => handleStatusChange('ACTIVE')}
            className={`inline-block py-4 px-4 text-sm font-medium ${
              selectedStatus === 'ACTIVE'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => handleStatusChange('COMPLETED')}
            className={`inline-block py-4 px-4 text-sm font-medium ${
              selectedStatus === 'COMPLETED'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => handleStatusChange('CANCELLED')}
            className={`inline-block py-4 px-4 text-sm font-medium ${
              selectedStatus === 'CANCELLED'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No requests found</h3>
          <p className="mt-2 text-gray-600 max-w-md mx-auto">
            {selectedStatus === 'ALL'
              ? "You don't have any service requests yet."
              : `You don't have any ${selectedStatus.toLowerCase()} service requests.`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-gray-50">
                <th className="p-4 font-semibold text-gray-600">Request ID</th>
                <th className="p-4 font-semibold text-gray-600">Service</th>
                <th className="p-4 font-semibold text-gray-600">Customer</th>
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4 font-semibold text-gray-600">Amount</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <span className="text-gray-500 text-sm">#{request.id.substring(0, 8)}</span>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-800">{request.service?.name || 'Unnamed Service'}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{request.service?.description}</div>
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
                  <td className="p-4 text-gray-600 whitespace-nowrap">
                    {formatDate(request.createdAt)}
                  </td>
                  <td className="p-4 font-medium whitespace-nowrap">
                    {formatCurrency(request.totalAmount)}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Link 
                        to={`/provider/requests/${request.id}`} 
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded-md transition-colors"
                      >
                        View
                      </Link>
                      
                      {getAvailableActions(request.status).map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleUpdateStatus(request.id, action.value)}
                          className={`px-3 py-1 text-white text-sm rounded-md transition-colors ${action.className}`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProviderServiceRequests;