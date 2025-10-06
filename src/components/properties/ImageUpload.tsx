import React, { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { propertyApi } from "../../services/api";

interface ImageUploadProps {
  images: string[];
  onUpload: (newImages: string[]) => void;
  onRemove: (index: number) => void;
  propertyId?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images = [],
  onUpload,
  onRemove,
  propertyId,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = useCallback(
    async (files: File[]) => {
      if (!propertyId) {
        // Just preview if no propertyId yet
        const newImages = files.map((file) => URL.createObjectURL(file));
        onUpload([...images, ...newImages]);
        return;
      }

      try {
        setIsUploading(true);
        setError(null);

        const response = await propertyApi.uploadImages(propertyId, files);
        onUpload([...images, ...response.urls]);
      } catch (err) {
        console.error("Error uploading images:", err);
        setError("Failed to upload images. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [images, onUpload, propertyId]
  );

  const triggerFileInput = () => {
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.click();
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-10 w-10 text-gray-400" />
          <div className="text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
            >
              <span>Upload files</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                disabled={isUploading}
              />
            </label>{" "}
            or drag and drop
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
        </div>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}
      {isUploading && (
        <div className="text-sm text-gray-500">Uploading images...</div>
      )}

      {images.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Uploaded Images ({images.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                  <img
                    src={image}
                    alt={`Property ${index + 1}`}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(index);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <ImageIcon className="h-12 w-12 mb-2" />
          <p>No images uploaded yet</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
