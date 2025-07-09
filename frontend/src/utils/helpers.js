// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Validate file type and size
export const validateFile = (
  file,
  maxSize = 5 * 1024 * 1024,
  allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"]
) => {
  const errors = [];

  if (!allowedTypes.includes(file.type)) {
    errors.push(
      "Invalid file type. Only JPEG, PNG, and GIF files are allowed."
    );
  }

  if (file.size > maxSize) {
    errors.push(
      `File size too large. Maximum size is ${formatFileSize(maxSize)}.`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Create image preview URL
export const createImagePreview = (file) => {
  return URL.createObjectURL(file);
};

// Cleanup image preview URL
export const cleanupImagePreview = (url) => {
  URL.revokeObjectURL(url);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Truncate text
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + "...";
};

// Get initials from name
export const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ""}${
    lastName?.charAt(0) || ""
  }`.toUpperCase();
};

// Generate avatar URL
export const generateAvatarUrl = (name) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=random&color=fff&size=200`;
};
