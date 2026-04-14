// src/components/ImageUpload.jsx
'use client';

import { useState } from 'react';

export default function ImageUpload({ 
  productId, 
  imageNumber, 
  currentImage, 
  onUploadComplete 
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);

  const handleDelete = async () => {
    if (!preview) return;
    
    // CRITICAL: Don't allow delete if no productId
    if (!productId) {
      alert('Please save the product first, then you can delete images');
      return;
    }
    
    if (!confirm('Delete this image?')) return;

    setUploading(true);
    try {
      // Extract correct publicId from Cloudinary URL
      // URL format: https://res.cloudinary.com/dmyekmpy3/image/upload/v1776173150/bikroy/products/lylybfr6eps1vab8f5dj.jpg
      const urlParts = preview.split('/');
      // Find the index of 'upload' in the URL
      const uploadIndex = urlParts.indexOf('upload');
      // Get all parts after 'upload' (skip version and folder)
      const relevantParts = urlParts.slice(uploadIndex + 2); // +2 to skip 'upload' and version number
      // Join with '/' and remove extension
      const publicId = relevantParts.join('/').split('.')[0];
      
      console.log('Extracted publicId:', publicId);
      console.log('ProductId:', productId);
      console.log('ImageField:', imageNumber);
      
      const response = await fetch(
        `/api/upload/delete?publicId=${encodeURIComponent(publicId)}&productId=${productId}&imageField=${imageNumber}`,
        { method: 'DELETE' }
      );

      const data = await response.json();

      if (response.ok) {
        setPreview(null);
        onUploadComplete?.(imageNumber, null);
        alert('Image deleted successfully');
      } else {
        alert('Delete failed: ' + data.error);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Something went wrong');
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (productId) {
        formData.append('productId', productId);
      }
      formData.append('imageNumber', imageNumber);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        onUploadComplete?.(imageNumber, data.data.url);
        alert('Image uploaded successfully!');
      } else {
        alert('Upload failed: ' + data.error);
        setPreview(currentImage);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Something went wrong');
      setPreview(currentImage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 text-center transition-colors border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt={`Preview ${imageNumber}`}
            className="object-cover w-full h-32 rounded-lg"
          />
          {!uploading && (
            <button
              type="button"
              onClick={handleDelete}
              className="absolute p-1 text-white transition-colors bg-red-500 rounded-full -top-2 -right-2 hover:bg-red-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
              <div className="inline-block w-6 h-6 border-b-2 border-white rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      ) : (
        <label className="block cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
          <div className="text-center">
            {uploading ? (
              <div className="inline-block w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            ) : (
              <>
                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">Click to upload</p>
                <p className="mt-1 text-xs text-gray-400">JPG, PNG, WebP up to 5MB</p>
              </>
            )}
          </div>
        </label>
      )}
    </div>
  );
}