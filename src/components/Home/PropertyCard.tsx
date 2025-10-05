import { Heart } from 'lucide-react';

type Property = {
  id: number;
  title: string;
  location: string;
  price: number;
  image: string;
  beds: number;
  tags: string[];
};

type PropertyCardProps = {
  property: Property;
};

export const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-56 object-cover"
        />
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition">
          <Heart className="h-5 w-5 text-gray-600" />
        </button>
        {property.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex space-x-2">
            {property.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
          <p className="text-lg font-bold text-blue-600">${property.price}<span className="text-sm text-gray-500">/mo</span></p>
        </div>
        <p className="text-gray-600 text-sm mt-1">{property.location}</p>
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <span className="flex items-center">
            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            {property.beds} {property.beds === 1 ? 'bed' : 'beds'}
          </span>
        </div>
      </div>
    </div>
  );
};
