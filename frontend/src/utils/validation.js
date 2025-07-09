// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }

  if (!hasUpperCase) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!hasLowerCase) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!hasNumbers) {
    errors.push("Password must contain at least one number");
  }

  if (!hasSpecialChar) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Name validation
export const validateName = (name, fieldName = "Name") => {
  const minLength = 2;
  const maxLength = 50;
  const nameRegex = /^[a-zA-Z\s]+$/;

  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push(`${fieldName} is required`);
  } else if (name.trim().length < minLength) {
    errors.push(`${fieldName} must be at least ${minLength} characters long`);
  } else if (name.trim().length > maxLength) {
    errors.push(`${fieldName} must not exceed ${maxLength} characters`);
  } else if (!nameRegex.test(name.trim())) {
    errors.push(`${fieldName} must contain only letters and spaces`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Required field validation
export const validateRequired = (value, fieldName = "Field") => {
  const errors = [];

  if (!value || (typeof value === "string" && value.trim().length === 0)) {
    errors.push(`${fieldName} is required`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  const errors = [];

  if (password !== confirmPassword) {
    errors.push("Passwords do not match");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
