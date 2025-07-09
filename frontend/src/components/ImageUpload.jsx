import React, { useState, useRef } from "react";
import { Camera, X, Upload } from "lucide-react";
import {
  validateFile,
  createImagePreview,
  cleanupImagePreview,
  formatFileSize,
} from "../utils/helpers.js";
import Button from "./Button.jsx";

const ImageUpload = ({
  onImageSelect,
  currentImage = null,
  label = "Profile Image",
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB
  className = "",
  error = null,
}) => {
  const [preview, setPreview] = useState(currentImage);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (file) => {
    if (!file) return;

    const validation = validateFile(file, maxSize);

    if (!validation.isValid) {
      onImageSelect(null, validation.errors[0]);
      return;
    }

    const previewUrl = createImagePreview(file);
    setPreview(previewUrl);
    onImageSelect(file, null);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    handleImageSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    handleImageSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeImage = () => {
    if (preview && preview.startsWith("blob:")) {
      cleanupImagePreview(preview);
    }
    setPreview(null);
    onImageSelect(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="flex flex-col items-center space-y-4">
        {/* Preview Area */}
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
            <Camera size={32} className="text-gray-400" />
          </div>
        )}

        {/* Upload Area */}
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 w-full max-w-md text-center
            ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
            ${error ? "border-red-300 bg-red-50" : ""}
            hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          <Upload size={24} className="mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-2">
            Drop an image here or{" "}
            <span className="text-blue-600 font-medium">browse</span>
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF up to {formatFileSize(maxSize)}
          </p>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openFileDialog}
          >
            Choose File
          </Button>
          {preview && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeImage}
            >
              Remove
            </Button>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
};

export default ImageUpload;
