export const validateTemperature = (value: string | number): boolean => {
  const num = parseFloat(String(value));
  if (isNaN(num)) return false;
  return num >= 50 && num <= 200;
};

export const validateHumidity = (value: string | number): boolean => {
  const num = parseFloat(String(value));
  if (isNaN(num)) return false;
  return num >= 0 && num <= 100;
};

export const validateFanSpeed = (value: string | number): boolean => {
  const num = parseFloat(String(value));
  if (isNaN(num)) return false;
  return num >= 0 && num <= 100;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const validateDeviceName = (name: string): boolean => {
  return !!(name && name.trim().length > 0 && name.trim().length <= 50);
};

export const validateDryingTime = (hours: string | number): boolean => {
  const num = parseFloat(String(hours));
  if (isNaN(num)) return false;
  return num > 0 && num <= 48;
};
