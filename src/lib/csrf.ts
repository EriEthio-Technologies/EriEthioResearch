import { randomBytes } from 'crypto';

// Generate CSRF token
export const generateCSRFToken = () => {
  return randomBytes(32).toString('hex');
};

// Validate CSRF token
export const validateCSRFToken = (token: string) => {
  return token.length === 64 && /^[a-f0-9]+$/.test(token);
}; 