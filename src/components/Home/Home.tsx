import { useState } from 'react';
import { Search, MapPin, Bed, Calendar, ArrowRight, User, Home as HomeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PropertyCard } from './PropertyCard';
import { TestimonialCard } from './TestimonialCard';

type Property = {
  id: number;
  title: string;
  location: string;
  price: number;
  image: string;
  beds: number;
  tags: string[];
};

type Testimonial = {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
};

export const Home = () => {
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  const featuredProperties: Property[] = [
    {
      id: 1,
      title: 'Modern Apartment in Downtown',
      location: 'New York, NY',
      price: 2500,
      beds: 2,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3',
      tags: ['Popular', 'New'],
    },
    // Add more properties as needed
  ];

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 5,
      comment: 'Found my dream home within days! The process was smooth and professional.',
    },
    // Add more testimonials as needed
  ];

  return (
    <div className="min-h-screen text-black">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <HomeIcon className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">HouseRental</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/landlord/dashboard" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <User className="h-4 w-4 mr-2" />
                Landlord Dashboard
              </Link>
              <Link 
                to="/auth" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-32 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-5xl font-bold mb-4 text-white">Find Your Next Home</h1>
          <p className="text-xl mb-8 text-white max-w-2xl mx-auto">Discover rentals tailored for you or manage your properties with our comprehensive landlord tools</p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            
            <select
              className="block w-full md:w-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="">Price Range</option>
              <option value="0-1000">$0 - $1000</option>
              <option value="1000-2000">$1000 - $2000</option>
              <option value="2000-3000">$2000 - $3000</option>
              <option value="3000+">$3000+</option>
            </select>
            
            <select
              className="block w-full md:w-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
            >
              <option value="">Bedrooms</option>
              <option value="1">1 Bed</option>
              <option value="2">2 Beds</option>
              <option value="3">3 Beds</option>
              <option value="4+">4+ Beds</option>
            </select>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center">
              <Search className="h-5 w-5 mr-2" />
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-black">Featured Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-center mx-auto">
              View All Properties <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-black">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Search</h3>
              <p className="text-gray-600">Find your perfect home with our advanced search filters.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Book</h3>
              <p className="text-gray-600">Schedule a viewing and book your new home.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bed className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Move In</h3>
              <p className="text-gray-600">Complete the paperwork and move into your new home.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-black">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-black py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">HouseRental</h3>
              <p className="text-gray-800">Find your dream home with our extensive collection of rental properties.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><button className="text-gray-800 hover:text-blue-600 transition focus:outline-none">Home</button></li>
                <li><button className="text-gray-800 hover:text-blue-600 transition focus:outline-none">Properties</button></li>
                <li><button className="text-gray-800 hover:text-blue-600 transition focus:outline-none">About Us</button></li>
                <li><button className="text-gray-800 hover:text-blue-600 transition focus:outline-none">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-800">
                <li>123 Rental Street</li>
                <li>New York, NY 10001</li>
                <li>info@houserental.com</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4 text-gray-800">
                <button className="text-gray-800 hover:text-blue-600 transition focus:outline-none">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </button>
                <button className="text-gray-800 hover:text-blue-600 transition focus:outline-none">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </button>
                <button className="text-gray-800 hover:text-blue-600 transition focus:outline-none">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-300 mt-12 pt-8 text-center text-gray-700">
            <p>&copy; {new Date().getFullYear()} HouseRental. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
