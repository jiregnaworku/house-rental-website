import { FiEdit2 } from 'react-icons/fi';
import { FiTrash2 } from 'react-icons/fi';
import { FiPlus } from 'react-icons/fi';
import { FiFilter } from 'react-icons/fi';
import { FiX } from 'react-icons/fi';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { propertyApi, Property } from '../../services/propertyApi';


const PropertyList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await propertyApi.getProperties();
        setProperties(data);
      } catch (err) {
        setError('Failed to fetch properties');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await propertyApi.deleteProperty(id);
        setProperties(properties.filter(property => property._id !== id));
      } catch (err) {
        console.error('Failed to delete property:', err);
        alert('Failed to delete property');
      }
    }
  };

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Properties</h1>
        <Link
          to="/properties/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={18} /> Add Property
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No properties found. Add your first property to get started.</p>
          </div>
        ) : (
          properties.map((property) => (
            <div key={property._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {property.images && property.images.length > 0 ? (
                <img
                  src={property.images[0]}
                  alt={property.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{property.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    property.status === 'available' ? 'bg-green-100 text-green-800' :
                    property.status === 'occupied' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">{property.address}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-blue-600 font-semibold">${property.price}/mo</span>
                  <div className="flex space-x-2">
                    <Link
                      to={`/properties/${property._id}`}
                      className="text-blue-500 hover:text-blue-700"
                      title="View"
                    >
                      <Eye size={18} />
                    </Link>
                    <Link
                      to={`/properties/edit/${property._id}`}
                      className="text-yellow-500 hover:text-yellow-700"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(property._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PropertyList;
