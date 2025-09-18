// src/utils/authUtils.js

/**
 * Notify components that authentication state has changed
 * This triggers the navbar and other components to update
 */
export const notifyAuthStateChange = () => {
  // Dispatch custom event for same-tab updates
  window.dispatchEvent(new Event('authStateChanged'));
  
  // Also dispatch storage event for cross-tab updates
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'authStateChanged',
    newValue: Date.now().toString(),
    storageArea: localStorage
  }));
};

/**
 * Login helper that stores auth data and notifies components
 */
export const setAuthData = (token, user) => {
  localStorage.setItem('accessToken', token);
  localStorage.setItem('user', JSON.stringify(user));
  notifyAuthStateChange();
};

/**
 * Logout helper that clears auth data and notifies components
 */
export const clearAuthData = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  notifyAuthStateChange();
};

/**
 * Check if user is currently authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

/**
 * Get current user data
 */
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

/**
 * Get current access token
 */
export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};