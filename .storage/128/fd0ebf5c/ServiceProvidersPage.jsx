import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ServiceProvidersPage = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // In a real app, this would fetch from API
    const fetchProviders = async () => {
      try {
        setLoading(true);
        // Mock data for now - would be replaced with actual API call
        const mockProviders = [
          {
            id: '1',
            name: 'Premium Plumbing Services',
            description: 'Professional plumbing solutions for residential and commercial needs',
            rating: 4.8,
            categories: ['Plumbing', 'Emergency Repairs'],
            imageUrl: 'https://images.unsplash.com/photo-1603976288852-ef9dfc808039?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            location: 'Los Angeles, CA'
          },
          {
            id: '2',
            name: 'Elite Electrical Co.',
            description: 'Licensed electricians for all your electrical needs',
            rating: 4.7,
            categories: ['Electrical', 'Smart Home'],
            imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            location: 'San Francisco, CA'
          },
          {
            id: '3',
            name: 'GreenThumb Landscaping',
            description: 'Complete landscaping services from design to maintenance',
            rating: 4.5,
            categories: ['Landscaping', 'Garden Design'],
            imageUrl: 'https://images.unsplash.com/photo-1590856029620-9b5a4825d3be?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            location: 'Seattle, WA'
          },
          {
            id: '4',
            name: 'CleanSweep Cleaning',
            description: 'Thorough home and office cleaning services',
            rating: 4.6,
            categories: ['Cleaning', 'Deep Cleaning'],
            imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            location: 'Portland, OR'
          },
          {
            id: '5',
            name: 'MasterCraft Construction',
            description: 'High-quality construction and renovation services',
            rating: 4.9,
            categories: ['Construction', 'Renovation'],
            imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            location: 'Denver, CO'
          }
        ];
        
        // Extract unique categories for filter
        const allCategories = mockProviders.flatMap(provider => provider.categories);
        setCategories([...new Set(allCategories)]);
        
        setProviders(mockProviders);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching service providers:', err);
        setError('Failed to load service providers. Please try again later.');
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  // Filter providers by search term and category
  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          provider.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          provider.location.toLowerCase().includes(searchTerm.toLowerCase());
                          
    const matchesCategory = selectedCategory === '' || 
                           provider.categories.includes(selectedCategory);
                           
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Service Providers</h1>
        <p className="text-gray-600 mt-2">Find the best service providers for your needs</p>
      </div>
      
      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          <div className="text-right">
            <span className="text-gray-600">
              {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* Loading Indicator */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredProviders.length === 0 ? (
        // No Results Found
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No providers found</h3>
          <p className="mt-2 text-gray-600">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      ) : (
        // Provider Cards Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map(provider => (
            <Link 
              to={`/providers/${provider.id}`}
              key={provider.id}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 overflow-hidden">
                {provider.imageUrl ? (
                  <img 
                    src={provider.imageUrl} 
                    alt={provider.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{provider.name}</h3>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">{provider.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{provider.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {provider.categories.map((category, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {provider.location}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceProvidersPage;