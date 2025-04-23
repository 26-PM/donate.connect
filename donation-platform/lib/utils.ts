import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Gets the authentication token from localStorage
 * @returns {string|null} The token or null if not found
 */
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

/**
 * Adds the authentication token to axios request config
 * @param {object} config - The axios request config
 * @returns {object} The config with auth header added
 */
export function addAuthHeader(config: any = {}): any {
  const token = getAuthToken();
  
  if (!token) {
    return config;
  }
  
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${token}`
    }
  };
}

