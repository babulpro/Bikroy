 'use client';

import { useState } from 'react';

export default function ProductImageManager({ 
  productId, 
  existingImages = [], 
  onImagesChange 
}) {
  const [images, setImages] = useState(existingImages);
  const [uploading, setUploading] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      formData.append('productId', productId);
      
      const response = await fetch('/api/product/allProduct/newProduct/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        const newImageUrls = data.data.images.map(img => img.url);
        const updatedImages = [...images, ...newImageUrls];
        setImages(updatedImages);
        onImagesChange?.(updatedImages); // Notify parent component
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageUrl, index) => {
    if (!confirm('Delete this image?')) return;
    
    try {
      const response = await fetch(
        `/api/product/newProduct/${productId}?url=${encodeURIComponent(imageUrl)}`,
        { method: 'DELETE' }
      );
      
      if (response.ok) {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
        onImagesChange?.(updatedImages); // Notify parent component
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleReorder = async (newOrder) => {
    try {
      const response = await fetch(`/api/product/newProduct/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageOrder: newOrder })
      });
      
      if (response.ok) {
        setImages(newOrder);
        onImagesChange?.(newOrder); // Notify parent component
      }
    } catch (error) {
      console.error('Reorder error:', error);
    }
  };

  const handleDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (dragIndex === null) return;
    
    const newImages = [...images];
    const [draggedItem] = newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, draggedItem);
    
    setImages(newImages);
    handleReorder(newImages);
    setDragIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {uploading ? 'Uploading...' : 'Upload Images'}
        </label>
        <p className="text-sm text-gray-500 mt-2">
          Max 10 images, up to 5MB each
        </p>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className="relative group border rounded-lg overflow-hidden cursor-move"
          >
            <img
              src={image}
              alt={`Product ${index + 1}`}
              className="w-full h-32 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
              <button
                type="button"
                onClick={() => handleDeleteImage(image, index)}
                className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              {index === 0 && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                  Primary
                </span>
              )}
            </div>
            <div className="absolute top-1 left-1 bg-gray-800 text-white text-xs px-1 rounded">
              {index + 1}
            </div>
          </div>
        ))}
        
        {/* Add Image Placeholder */}
        {images.length === 0 && (
          <div className="col-span-4 text-center py-8 text-gray-500">
            No images uploaded yet. Click "Upload Images" to add photos of your product.
          </div>
        )}
      </div>

      {/* Image Info */}
      <div className="text-sm text-gray-600">
        <p>Total Images: {images.length}/10</p>
        <p className="text-xs mt-1">💡 Tip: Drag images to reorder. First image will be the primary photo.</p>
      </div>
    </div>
  );
}