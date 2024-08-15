// src/utils/validators/userValidation.ts
export const usernameRegex = /^[a-zA-Z0-9]{3,15}$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex = /^.{8,}$/;

export const validateUsername = (username: string): boolean => {
  return usernameRegex.test(username);
};

export const validateEmail = (email: string): boolean => {
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return passwordRegex.test(password);
};
