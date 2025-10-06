import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { propertyApi } from "../../services/api";
import { toast } from "react-toastify";
import { X, Upload, Trash2 } from 'lucide-react';

interface FormData {
  name: string;
  description: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  status: "available" | "occupied" | "maintenance";
  amenities: string[];
  location: { lat: number; lng: number };
}

// Yup schema matching FormData
const propertySchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  address: yup.string().required("Address is required"),
  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be positive"),
  bedrooms: yup.number().required("Bedrooms required").min(0),
  bathrooms: yup.number().required("Bathrooms required").min(0),
  area: yup.number().required("Area required").positive(),
  status: yup
    .string()
    .oneOf(["available", "occupied", "maintenance"])
    .required(),
  amenities: yup.array().of(yup.string().required()).required(),
  location: yup
    .object({
      lat: yup.number().required("Latitude is required"),
      lng: yup.number().required("Longitude is required"),
    })
    .required(),
});

const PropertyForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(propertySchema) as any, // TS-safe cast
    defaultValues: {
      name: "",
      description: "",
      address: "",
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      status: "available",
      amenities: [],
      location: { lat: 0, lng: 0 },
    },
  });

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImageFiles = [...imageFiles, ...files];
      setImageFiles(newImageFiles);
      
      // Create preview URLs
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...newPreviewUrls]);
    }
  };

  // Remove an image
  const handleRemoveImage = (index: number) => {
    const newImageFiles = [...imageFiles];
    const newPreviewImages = [...previewImages];
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewImages[index]);
    
    newImageFiles.splice(index, 1);
    newPreviewImages.splice(index, 1);
    
    setImageFiles(newImageFiles);
    setPreviewImages(newPreviewImages);
  };

  // Fetch existing property if editing
  useEffect(() => {
    if (isEditMode && id) {
      const fetchProperty = async () => {
        setIsLoading(true);
        try {
          const property = await propertyApi.getProperty(id);
          setPreviewImages(property.images || []);
          reset({
            ...property,
            location: {
              lat: property.location?.coordinates[1] || 0,
              lng: property.location?.coordinates[0] || 0,
            },
          });
        } catch (err) {
          setError("Failed to fetch property");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProperty();
    }
  }, [id, isEditMode, reset]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setError(null);
    setIsSubmitting(true);
    console.log('Submitting property form...', data);
    try {
      const propertyData = {
        name: data.name,
        description: data.description,
        address: data.address,
        price: data.price,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        area: data.area,
        status: data.status,
        amenities: data.amenities,
        location: {
          type: "Point",
          coordinates: [data.location.lng, data.location.lat],
        },
        isActive: true,
      };

      if (isEditMode && id) {
        await toast.promise(
          (async () => {
            const updated = await propertyApi.updateProperty(id, {
              ...propertyData,
              images: previewImages,
            });
            if (imageFiles.length > 0) {
              await propertyApi.uploadPropertyImages(id, imageFiles);
            }
            return updated;
          })(),
          { pending: 'Updating property...', success: 'Property updated', error: 'Update failed' }
        );
      } else {
        const created = await toast.promise(propertyApi.createProperty(propertyData), {
          pending: 'Creating property...',
          success: 'Property created',
          error: 'Create failed',
        });
        const createdId = created?._id || created?.id;
        if (createdId && imageFiles.length > 0) {
          await toast.promise(propertyApi.uploadPropertyImages(createdId, imageFiles), {
            pending: 'Uploading images...',
            success: 'Images uploaded',
            error: 'Image upload failed',
          });
        }
      }
      
      toast.success(`Property ${isEditMode ? 'updated' : 'created'} successfully!`);
      navigate("/landlord/dashboard");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save property";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Property save failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isLoading)
    return <div className="flex justify-center p-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {isEditMode ? "Edit Property" : "Add New Property"}
          </h1>
          <Link to="/properties" className="text-gray-600 hover:text-gray-800">
            ← Back to Properties
          </Link>
        </div>

        {/* Image Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-medium mb-4">Property Images</h2>
          
          {/* Image Preview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
            {previewImages.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            
            {/* Add Image Button */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors"
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Add Images</span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
                multiple
              />
            </div>
          </div>
          <p className="text-sm text-gray-500">Upload at least one image. Max 10 images.</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["name", "price", "area", "bedrooms", "bathrooms"].map(
                (fieldName) => (
                  <div key={fieldName} className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} *
                    </label>
                    <Controller
                      name={fieldName as keyof FormData}
                      control={control as any}
                      render={({ field }) => (
                        <input
                          {...field}
                          type={
                            ["price", "area", "bedrooms", "bathrooms"].includes(
                              fieldName
                            )
                              ? "number"
                              : "text"
                          }
                          className={`w-full p-2 border rounded-md ${
                            errors[fieldName as unknown as keyof FormData]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                      )}
                    />
                    {errors[fieldName as keyof FormData] && (
                      <p className="text-red-500 text-sm mt-1">
                        {(errors[fieldName as keyof FormData] as any)?.message}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`w-full p-2 border rounded-md ${
                      errors.status ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="available">available</option>
                    <option value="occupied">occupied</option>
                    <option value="maintenance">maintenance</option>
                  </select>
                )}
              />
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
              )}
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
                    className={`w-full p-2 border rounded-md ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["lat", "lng"].map((coord) => (
                <div key={coord} className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {coord === "lat" ? "Latitude" : "Longitude"} *
                  </label>
                  <Controller
                    name={`location.${coord}` as keyof FormData}
                    control={control as any}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        step="any"
                        className={`w-full p-2 border rounded-md ${
                          errors.location?.[coord as keyof FormData["location"]]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                    )}
                  />
                  {errors.location?.[coord as keyof FormData["location"]] && (
                    <p className="text-red-500 text-sm mt-1">
                      {
                        (
                          errors.location?.[
                            coord as keyof FormData["location"]
                          ] as any
                        )?.message
                      }
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Images section was already implemented above with previews and file input */}

          {/* Amenities */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                "WiFi",
                "Parking",
                "Air Conditioning",
                "Heating",
                "Washer",
                "Kitchen",
                "TV",
                "Gym",
                "Pool",
                "Garden",
                "Balcony",
                "Elevator",
              ].map((amenity) => (
                <div key={amenity} className="flex items-center">
                  <Controller
                    name="amenities"
                    control={control as any}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        id={`amenity-${amenity}`}
                        checked={field.value?.includes(amenity)}
                        onChange={(e) =>
                          field.onChange(
                            e.target.checked
                              ? [...(field.value || []), amenity]
                              : field.value?.filter(
                                  (v: string) => v !== amenity
                                )
                          )
                        }
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                    )}
                  />
                  <label
                    htmlFor={`amenity-${amenity}`}
                    className="ml-2 text-sm text-gray-700"
                  >
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
              {isSubmitting ? "Saving..." : "Save Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;
