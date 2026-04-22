// Validator functions
export const validateTemperature = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  return num >= 50 && num <= 200;
};

export const validateHumidity = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  return num >= 0 && num <= 100;
};

export const validateFanSpeed = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  return num >= 0 && num <= 100;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const validateDeviceName = (name) => {
  return name && name.trim().length > 0 && name.trim().length <= 50;
};

export const validateDryingTime = (hours) => {
  const num = parseFloat(hours);
  if (isNaN(num)) return false;
  return num > 0 && num <= 48;
};
