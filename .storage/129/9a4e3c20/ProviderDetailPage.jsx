import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProviderDetailPage = () => {
  const { providerId } = useParams();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('services');
  
  useEffect(() => {
    const fetchProviderDetails = async () => {
      try {
        setLoading(true);
        // Mock data - would be replaced with API call
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock provider data
        const mockProvider = {
          id: providerId,
          name: 'Premium Plumbing Services',
          description: 'Professional plumbing solutions for residential and commercial needs. We have over 15 years of experience in the industry and are fully licensed and insured. Our team of skilled plumbers can handle any plumbing issue, from simple repairs to complex installations.',
          rating: 4.8,
          reviewCount: 124,
          categories: ['Plumbing', 'Emergency Repairs', 'Water Heater Installation'],
          imageUrl: 'https://images.unsplash.com/photo-1603976288852-ef9dfc808039?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          location: 'Los Angeles, CA',
          contactPhone: '(555) 123-4567',
          contactEmail: 'info@premiumplumbing.com',
          website: 'https://www.premiumplumbing.example.com',
          yearEstablished: 2008,
          operatingHours: [
            { day: 'Monday', hours: '8:00 AM - 6:00 PM' },
            { day: 'Tuesday', hours: '8:00 AM - 6:00 PM' },
            { day: 'Wednesday', hours: '8:00 AM - 6:00 PM' },
            { day: 'Thursday', hours: '8:00 AM - 6:00 PM' },
            { day: 'Friday', hours: '8:00 AM - 6:00 PM' },
            { day: 'Saturday', hours: '9:00 AM - 4:00 PM' },
            { day: 'Sunday', hours: 'Closed' }
          ],
          services: [
            {
              id: '1',
              name: 'Emergency Plumbing Repair',
              description: '24/7 emergency plumbing repair services for leaks, bursts, and blockages.',
              price: 'From $85/hour',
              imageUrl: 'https://images.unsplash.com/photo-1583950592411-c9fa9a6c9a75?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
            },
            {
              id: '2',
              name: 'Bathroom Remodeling',
              description: 'Complete bathroom renovation and fixture installation services.',
              price: 'Custom quote',
              imageUrl: 'https://images.unsplash.com/photo-1569597967185-cd6120712154?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
            },
            {
              id: '3',
              name: 'Water Heater Installation',
              description: 'Installation and replacement of water heaters, including tankless options.',
              price: 'From $250',
              imageUrl: 'https://images.unsplash.com/photo-1577593980495-6e8b4eecc3cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
            }
          ],
          reviews: [
            {
              id: '1',
              userName: 'John Smith',
              rating: 5,
              date: '2023-06-15',
              comment: 'Excellent service! Fixed my burst pipe quickly and professionally.',
              userImage: 'https://randomuser.me/api/portraits/men/32.jpg'
            },
            {
              id: '2',
              userName: 'Maria Rodriguez',
              rating: 4,
              date: '2023-05-22',
              comment: 'Good job installing our new water heater. Very knowledgeable technician.',
              userImage: 'https://randomuser.me/api/portraits/women/44.jpg'
            },
            {
              id: '3',
              userName: 'David Chen',
              rating: 5,
              date: '2023-04-30',
              comment: 'Fast response to my emergency call. Fair pricing and excellent work.',
              userImage: 'https://randomuser.me/api/portraits/men/62.jpg'
            }
          ]
        };
        
        setProvider(mockProvider);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching provider details:', err);
        setError('Failed to load service provider details. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchProviderDetails();
  }, [providerId]);
  
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i - rating < 1) {
        // Half star
        stars.push(
          <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }
    return stars;
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }
  
  if (!provider) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          Provider not found.
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Provider Header */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="relative h-64">
          <img 
            src={provider.imageUrl} 
            alt={provider.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <h1 className="text-3xl font-bold text-white">{provider.name}</h1>
            <div className="flex items-center mt-2">
              <div className="flex mr-2">
                {renderStars(provider.rating)}
              </div>
              <span className="text-white">
                {provider.rating.toFixed(1)} ({provider.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>
        
        {/* Provider Categories */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-2 mb-4">
            {provider.categories.map((category, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
          
          <p className="text-gray-700 mb-4">{provider.description}</p>
          
          <div className="flex flex-wrap items-center text-gray-600 gap-6">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {provider.location}
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {provider.contactPhone}
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {provider.contactEmail}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="mb-8 border-b border-gray-200">
        <div className="flex flex-wrap -mb-px">
          <button
            onClick={() => setActiveTab('services')}
            className={`inline-block py-4 px-4 text-sm font-medium ${
              activeTab === 'services'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`inline-block py-4 px-4 text-sm font-medium ${
              activeTab === 'reviews'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'
            }`}
          >
            Reviews
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`inline-block py-4 px-4 text-sm font-medium ${
              activeTab === 'about'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'
            }`}
          >
            About
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {provider.services.map(service => (
            <Link 
              key={service.id} 
              to={`/services/${service.id}`}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 overflow-hidden">
                {service.imageUrl ? (
                  <img 
                    src={service.imageUrl} 
                    alt={service.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{service.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-600">{service.price}</span>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {provider.reviews.map(review => (
            <div key={review.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  {review.userImage ? (
                    <img 
                      src={review.userImage} 
                      alt={review.userName} 
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-800">{review.userName}</h4>
                    <span className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex mt-1 mb-2">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {activeTab === 'about' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Company Information</h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Established</dt>
                  <dd className="mt-1 text-gray-900">{provider.yearEstablished}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Website</dt>
                  <dd className="mt-1 text-blue-600 hover:underline">
                    <a href={provider.website} target="_blank" rel="noopener noreferrer">
                      {provider.website}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Contact Information</dt>
                  <dd className="mt-1 text-gray-900">
                    <p>{provider.contactPhone}</p>
                    <p>{provider.contactEmail}</p>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-gray-900">{provider.location}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Operating Hours</h3>
              <ul className="space-y-2">
                {provider.operatingHours.map((item, index) => (
                  <li key={index} className="flex justify-between">
                    <span className="text-gray-600">{item.day}</span>
                    <span className="font-medium">{item.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDetailPage;