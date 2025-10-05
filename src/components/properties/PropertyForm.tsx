import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm, Controller, FieldValues, Control, FieldError } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { propertyApi, Property } from '../../services/propertyApi';
import ImageUpload from './ImageUpload';

const propertySchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  address: yup.string().required('Address is required'),
  price: yup.number().required('Price is required').positive('Price must be positive'),
  bedrooms: yup.number().required('Number of bedrooms is required').min(0, 'Must be 0 or more'),
  bathrooms: yup.number().required('Number of bathrooms is required').min(0, 'Must be 0 or more'),
  area: yup.number().required('Area is required').positive('Area must be positive'),
  status: yup.string().oneOf(['available', 'occupied', 'maintenance']).required('Status is required'),
  amenities: yup.array().of(yup.string()),
  'location.lat': yup.number().required('Latitude is required'),
  'location.lng': yup.number().required('Longitude is required'),
});

type FormData = Omit<Property, '_id' | 'images' | 'createdAt' | 'updatedAt' | 'landlord' | 'location'> & {
  location: {
    lat: number;
    lng: number;
  };
};

type ControllerRenderProps = {
  value: any;
  onChange: (...event: any[]) => void;
  onBlur: () => void;
  name: string;
  ref: React.Ref<any>;
};

type ControllerProps = {
  field: ControllerRenderProps;
  fieldState: {
    error?: FieldError;
  };
};

const PropertyForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(propertySchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      status: 'available',
      amenities: [],
      location: { lat: 0, lng: 0 }
    }
  });

  useEffect(() => {
    if (isEditMode && id) {
      const fetchProperty = async () => {
        try {
          setIsLoading(true);
          const property = await propertyApi.getProperty(id);
          setImages(property.images || []);
          reset({
            ...property,
            location: {
              lat: property.location?.coordinates[1] || 0,
              lng: property.location?.coordinates[0] || 0
            }
          });
        } catch (err) {
          setError('Failed to fetch property');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProperty();
    }
  }, [id, isEditMode, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const propertyData = {
        ...data,
        images,
        location: {
          type: 'Point',
          coordinates: [data.location.lng, data.location.lat]
        }
      };

      if (isEditMode && id) {
        await propertyApi.updateProperty(id, propertyData);
      } else {
        await propertyApi.createProperty(propertyData);
      }
      
      navigate('/properties');
    } catch (err) {
      setError('Failed to save property');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (newImages: string[]) => {
    setImages([...images, ...newImages]);
  };

  const handleImageRemove = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading property details...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'Edit Property' : 'Add New Property'}
          </h1>
          <Link
            to="/properties"
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to Properties
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Name *
                </label>
                <Controller
                  name="name"
                  control={control as unknown as Control<FieldValues>}
                  render={({ field }: { field: ControllerRenderProps }) => (
                    <input
                      {...field}
                      type="text"
                      className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g., Modern Downtown Apartment"
                    />
                  )}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full p-2 border rounded-md ${errors.status ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Under Maintenance</option>
                    </select>
                  )}
                />
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per month ($) *
                </label>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      min="0"
                      step="0.01"
                      className={`w-full p-2 border rounded-md ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g., 1500"
                    />
                  )}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area (sq ft) *
                </label>
                <Controller
                  name="area"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      min="0"
                      className={`w-full p-2 border rounded-md ${errors.area ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g., 1200"
                    />
                  )}
                />
                {errors.area && (
                  <p className="text-red-500 text-sm mt-1">{errors.area.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms *
                </label>
                <Controller
                  name="bedrooms"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      min="0"
                      className={`w-full p-2 border rounded-md ${errors.bedrooms ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g., 2"
                    />
                  )}
                />
                {errors.bedrooms && (
                  <p className="text-red-500 text-sm mt-1">{errors.bedrooms.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms *
                </label>
                <Controller
                  name="bathrooms"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      min="0"
                      step="0.5"
                      className={`w-full p-2 border rounded-md ${errors.bathrooms ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g., 1.5"
                    />
                  )}
                />
                {errors.bathrooms && (
                  <p className="text-red-500 text-sm mt-1">{errors.bathrooms.message}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={4}
                    className={`w-full p-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Describe the property in detail..."
                  />
                )}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Location</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`w-full p-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Full address"
                    />
                  )}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude *
                </label>
                <Controller
                  name="location.lat"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      step="any"
                      className={`w-full p-2 border rounded-md ${errors.location?.lat ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g., 40.7128"
                    />
                  )}
                />
                {errors.location?.lat && (
                  <p className="text-red-500 text-sm mt-1">{errors.location.lat.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude *
                </label>
                <Controller
                  name="location.lng"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      step="any"
                      className={`w-full p-2 border rounded-md ${errors.location?.lng ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g., -74.0060"
                    />
                  )}
                />
                {errors.location?.lng && (
                  <p className="text-red-500 text-sm mt-1">{errors.location.lng.message}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">
                Tip: You can find coordinates using <a href="https://www.latlong.net/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">latlong.net</a>
              </p>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Property Images</h2>
            <ImageUpload 
              images={images}
              onUpload={handleImageUpload}
              onRemove={handleImageRemove}
              propertyId={id}
            />
          </div>

          {/* Amenities */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {['WiFi', 'Parking', 'Air Conditioning', 'Heating', 'Washer', 'Kitchen', 'TV', 'Gym', 'Pool', 'Garden', 'Balcony', 'Elevator'].map((amenity) => (
                <div key={amenity} className="flex items-center">
                  <Controller
                    name="amenities"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        id={`amenity-${amenity}`}
                        checked={field.value?.includes(amenity)}
                        onChange={(e) => {
                          const value = e.target.checked
                            ? [...(field.value || []), amenity]
                            : field.value?.filter((item) => item !== amenity) || [];
                          field.onChange(value);
                        }}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                    )}
                  />
                  <label htmlFor={`amenity-${amenity}`} className="ml-2 text-sm text-gray-700">
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              to="/properties"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;
