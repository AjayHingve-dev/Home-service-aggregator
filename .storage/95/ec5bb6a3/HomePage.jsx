import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ServiceService from '../../services/ServiceService';

const HomePage = () => {
  const [popularServices, setPopularServices] = useState([]);
  const [featuredProviders, setFeaturedProviders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real implementation, we'd have specific endpoints for popular services and featured providers
        const services = await ServiceService.getAllServices();
        setPopularServices(services.slice(0, 6)); // Just take first 6 for demo purposes
        
        // Mock featured providers for now
        setFeaturedProviders([
          { id: 1, name: 'John Plumbing Services', rating: 4.8, category: 'Plumbing', image: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-4.0.3' },
          { id: 2, name: 'Elite Electrical', rating: 4.7, category: 'Electrical', image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?ixlib=rb-4.0.3' },
          { id: 3, name: 'Green Thumb Landscaping', rating: 4.9, category: 'Landscaping', image: 'https://images.unsplash.com/photo-1600240644455-3edc55c375fe?ixlib=rb-4.0.3' }
        ]);
      } catch (error) {
        console.error('Error fetching home page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to search results page with the query
    window.location.href = `/services/search?q=${encodeURIComponent(searchQuery)}`;
  };

  const serviceCategories = [
    { name: 'Plumbing', icon: '🔧', color: 'bg-blue-100' },
    { name: 'Electrical', icon: '💡', color: 'bg-yellow-100' },
    { name: 'Cleaning', icon: '🧹', color: 'bg-green-100' },
    { name: 'Gardening', icon: '🌿', color: 'bg-emerald-100' },
    { name: 'Painting', icon: '🎨', color: 'bg-purple-100' },
    { name: 'Moving', icon: '📦', color: 'bg-orange-100' },
    { name: 'Repair', icon: '🛠️', color: 'bg-red-100' },
    { name: 'Carpentry', icon: '🪚', color: 'bg-amber-100' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-center max-w-3xl leading-tight">
            Find Trusted Service Providers for All Your Home Needs
          </h1>
          <p className="text-xl mt-6 text-center max-w-2xl">
            Connect with qualified professionals in your area for plumbing, electrical work, cleaning, and more.
          </p>
          
          {/* Search Bar */}
          <div className="mt-10 w-full max-w-2xl">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="What service do you need?"
                className="flex-grow px-5 py-4 rounded-l-md focus:outline-none text-gray-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-4 rounded-r-md transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Service Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {serviceCategories.map((category, index) => (
              <Link
                key={index}
                to={`/services/category/${category.name.toLowerCase()}`}
                className={`${category.color} p-6 rounded-lg text-center hover:shadow-md transition-shadow group`}
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Services</h2>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularServices.map((service) => (
                <Link 
                  key={service.id}
                  to={`/services/${service.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 bg-gray-200">
                    {service.imageUrl ? (
                      <img 
                        src={service.imageUrl} 
                        alt={service.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800">{service.name}</h3>
                    <p className="text-gray-600 mt-2">{service.description?.substring(0, 100)}...</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-blue-600 font-semibold">${service.price}</span>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-gray-600">{service.rating || '4.5'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <div className="mt-10 text-center">
            <Link 
              to="/services" 
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Service Providers */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Service Providers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProviders.map((provider) => (
              <Link
                key={provider.id}
                to={`/providers/${provider.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48">
                  <img 
                    src={provider.image} 
                    alt={provider.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800">{provider.name}</h3>
                  <p className="text-gray-500">{provider.category}</p>
                  <div className="mt-4 flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i}
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-5 w-5 ${i < Math.floor(provider.rating) ? 'text-yellow-500' : 'text-gray-300'}`} 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600">{provider.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <Link 
              to="/providers" 
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              View All Providers
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Find a Service</h3>
              <p className="text-gray-600">
                Browse through our wide range of home services or search for a specific service you need.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Book an Appointment</h3>
              <p className="text-gray-600">
                Choose a service provider, select your preferred date and time, and submit your request.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Get the Job Done</h3>
              <p className="text-gray-600">
                The service provider will come to your location and complete the requested service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Join thousands of satisfied customers who have found reliable service providers through our platform.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              to="/services" 
              className="px-6 py-3 bg-white text-blue-700 rounded-md hover:bg-blue-50 transition-colors"
            >
              Find a Service
            </Link>
            <Link 
              to="/register" 
              className="px-6 py-3 bg-blue-800 text-white rounded-md hover:bg-blue-900 transition-colors"
            >
              Register Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;