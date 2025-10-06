import React from 'react';
import { Pencil, Trash, Plus } from 'lucide-react';
import type { Property as ApiProperty } from '../../services/api';

interface PropertiesViewProps {
  properties: ApiProperty[];
  loading: boolean;
  error: string | null;
  onAddProperty?: () => void;
  onEditProperty?: (id: string) => void;
  onDeleteProperty?: (id: string) => void;
}

const PropertiesView: React.FC<PropertiesViewProps> = ({
  properties,
  loading,
  error,
  onAddProperty,
  onEditProperty,
  onDeleteProperty,
}) => {
  const handleAdd = onAddProperty ?? (() => {});
  const handleEdit = onEditProperty ?? (() => {});
  const handleDelete = onDeleteProperty ?? (() => {});
  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (error)
    return <p className="p-4 text-red-600 bg-red-100 rounded-lg">Error: {error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Properties</h2>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Property
        </button>
      </div>

      {properties.length === 0 ? (
        <p className="text-gray-500">No properties found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {properties.map((property) => (
                <tr key={property.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{property.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{property.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{property.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${property.rent}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        property.status === 'occupied' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {property.status === 'occupied' ? 'Occupied' : 'Vacant'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => handleEdit(property.id)} className="text-indigo-600 hover:text-indigo-900">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(property.id)} className="text-red-600 hover:text-red-900">
                      <Trash className="w-4 h-4" />
                    </button>
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

export default PropertiesView;
