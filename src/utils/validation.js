/**
 * Validates if a string is a valid email address
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email, false otherwise
 */
export const validateEmail = (email) => {
  if (!email) return false;
  
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates if a string is a valid name or surname
 * @param {string} name - Name to validate
 * @returns {boolean} - True if valid name, false otherwise
 */
export const validateName = (name) => {
  if (!name) return false;
  
  // Name should be at least 2 characters and contain only letters and spaces
  return name.trim().length >= 2 && /^[A-Za-z\s'-]+$/.test(name);
};