// src/api/AuthApi.js

import { API_ENDPOINTS, combineHeaders } from './config';

/**
 * Login a user with email/phone and password
 * @param {string} identifier - Email or phone number
 * @param {string} password - User password
 * @returns {Promise<Object>} - Contains access token and user object
 * @throws {Object} - Error object from the server
 */
export const loginUser = async (identifier, password) => {
  try {
    if (!identifier || !password) {
      throw new Error('Both username/email and password are required');
    }

    // For debugging: Log what's being sent (remove in production)
    console.log('Login attempt with:', { identifier, password: '****' });
    
    const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        username: identifier, // Try sending as username
        password: password,
        // Also include email in case backend looks for that
        email: identifier.includes('@') ? identifier : undefined
      }),
    });

    // For debugging: Log response status (remove in production)
    console.log('Login response status:', response.status);

    const data = await response.json();

    // For debugging: Log response data (remove sensitive info in production)
    console.log('Login response data:', data);

    // If response is not ok, throw the error data for handling
    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    // Re-throw the error to be handled by the component
    throw error;
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - Contains user data and possibly a token
 */
export const registerUser = async (userData) => {
  try {
    let requestConfig = {
      method: 'POST',
    };
    if (userData instanceof FormData) {
      requestConfig.body = userData;
      console.log('Sending FormData (with file upload)');
    } else {
      // For regular JSON data
      requestConfig.headers = combineHeaders();
      requestConfig.body = JSON.stringify(userData);
      console.log('Sending JSON data');
    }

    const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, requestConfig);
    const data = await response.json();

    if (!response.ok) {
      let errorMessage = 'Registration failed';
      if (typeof data === 'object') {
        const errorFields = Object.keys(data);
        
        if (errorFields.length > 0) {
          const firstField = errorFields[0];
          const fieldError = Array.isArray(data[firstField]) 
            ? data[firstField][0] 
            : data[firstField];
          
          errorMessage = `${firstField}: ${fieldError}`;
          
          if (firstField === 'email' && fieldError.includes('already exists')) {
            errorMessage = 'This email is already registered. Please use a different email or try logging in.';
          } else if (firstField === 'phone_number' && fieldError.includes('already exists')) {
            errorMessage = 'This phone number is already registered. Please use a different number or try logging in.';
          }
        } else if (data.error) {
          errorMessage = data.error;
        } else if (data.message) {
          errorMessage = data.message;
        }
      } else if (typeof data === 'string') {
        errorMessage = data;
      }
      
      throw {
        message: errorMessage,
        originalError: data,
        status: response.status
      };
    }

    return data;
  } catch (error) {
    if (error.message && error.originalError) {
      throw error;
    }
    
    throw {
      message: error.message || 'Network error during registration',
      originalError: error,
      status: 'NETWORK_ERROR'
    };
  }
};
/**
 * Get current user profile with enhanced debugging
 * @returns {Promise<Object>} - User profile data
 */
export const getUserProfile = async () => {
  try {
    console.log('Making request to:', API_ENDPOINTS.USER.PROFILE);
    console.log('Headers:', combineHeaders());
    
    const response = await fetch(API_ENDPOINTS.USER.PROFILE, {
      method: 'GET',
      headers: combineHeaders(),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    console.log('Response URL:', response.url);

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);

    if (!contentType || !contentType.includes('application/json')) {
      // Get the HTML response for debugging
      const htmlText = await response.text();
      console.error('Received HTML instead of JSON:', htmlText.substring(0, 500));
      
      throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}. Check if the API endpoint exists.`);
    }

    const data = await response.json();
    console.log('Get profile response:', data);

    if (!response.ok) {
      throw {
        message: data.message || data.error || 'Failed to fetch profile',
        status: response.status,
        data: data
      };
    }

    return data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};
export const updateUserProfile = async (profileData) => {
  try {
    console.log('Making update request to:', API_ENDPOINTS.USER.PROFILE);
    
    let requestConfig = {
      method: 'PATCH',
      headers: combineHeaders(),
    };

    if (profileData instanceof FormData) {
      const headers = combineHeaders();
      delete headers['Content-Type'];
      requestConfig.headers = headers;
      requestConfig.body = profileData;
      console.log('Sending FormData for profile update');
      
      // Debug FormData contents
      console.log('FormData entries:');
      for (let [key, value] of profileData.entries()) {
        console.log(key, typeof value === 'object' ? '[File]' : value);
      }
    } else {
      requestConfig.body = JSON.stringify(profileData);
      console.log('Sending JSON data for profile update:', profileData);
    }

    const response = await fetch(API_ENDPOINTS.USER.PROFILE, requestConfig);
    
    console.log('Update response status:', response.status);
    console.log('Update response URL:', response.url);

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const htmlText = await response.text();
      console.error('Update received HTML instead of JSON:', htmlText.substring(0, 500));
      throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Update profile response:', data);

    if (!response.ok) {
      if (response.status === 400 && typeof data === 'object') {
        const errorMessages = [];
        Object.keys(data).forEach(field => {
          if (Array.isArray(data[field])) {
            errorMessages.push(`${field}: ${data[field][0]}`);
          } else {
            errorMessages.push(`${field}: ${data[field]}`);
          }
        });
        throw {
          message: errorMessages.join(', '),
          fields: data,
          status: response.status
        };
      }
      throw data;
    }

    return data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

// Export other functions...
export const changeUserPassword = async (oldPassword, newPassword, confirmPassword) => {
  try {
    const response = await fetch(API_ENDPOINTS.USER.CHANGE_PASSWORD, {
      method: 'POST',
      headers: combineHeaders(),
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      }),
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const htmlText = await response.text();
      console.error('Change password received HTML:', htmlText.substring(0, 500));
      throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Change password response:', data);

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};

export const deleteProfilePicture = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.USER.DELETE_PICTURE, {
      method: 'DELETE',
      headers: combineHeaders(),
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const htmlText = await response.text();
      console.error('Delete picture received HTML:', htmlText.substring(0, 500));
      throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Delete picture response:', data);

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    console.error('Delete picture error:', error);
    throw error;
  }
};

/**
 * Request a password reset email
 * @param {string} email - User's email address
 * @returns {Promise<Object>} - Success message
 * @throws {Object} - Error object from the server
 */
export const forgotPassword = async (email) => {
  try {
    // For debugging
    console.log('Requesting password reset for email:', email);
    
    const response = await fetch(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: 'POST',
      headers: combineHeaders(),
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    console.log('Password reset request response:', data);

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
};

/**
 * Validate a password reset token
 * @param {string} token - Reset token from URL
 * @returns {Promise<Object>} - Token validation result
 * @throws {Object} - Error object from the server
 */
export const validateResetToken = async (token) => {
  try {
    console.log('Validating reset token:', token);
    
    const response = await fetch(API_ENDPOINTS.AUTH.RESET_PASSWORD + '/validate/', {
      method: 'POST',
      headers: combineHeaders(),
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    console.log('Token validation response:', data);

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    console.error('Token validation error:', error);
    throw error;
  }
};

/**
 * Reset password with token
 * @param {string} token - Reset token from email
 * @param {string} password - New password
 * @param {string} [confirmPassword] - Confirm password if required by API
 * @returns {Promise<Object>} - Success message
 * @throws {Object} - Error object from the server
 */
export const resetPassword = async (token, password, confirmPassword) => {
  try {
    console.log('Resetting password with token:', token ? 'token provided' : 'no token');
    
    // Prepare request body based on whether confirmPassword is provided
   const requestBody = {
      token,
      password,
      confirm_password: confirmPassword || password  // Use password if confirmPassword is empty
    };
    
    const response = await fetch(API_ENDPOINTS.AUTH.RESET_PASSWORD + '/confirm/', {
      method: 'POST',
      headers: combineHeaders(),
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log('Password reset response:', data);

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

/**
 * Change user password (when logged in)
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} - Success message
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      method: 'POST',
      headers: combineHeaders(),
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Verify email with token
 * @param {string} token - Verification token
 * @returns {Promise<Object>} - Success message
 */
export const verifyEmail = async (token) => {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
      method: 'POST',
      headers: combineHeaders(),
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Refresh JWT token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} - New access token
 */
export const refreshToken = async (refreshToken) => {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      method: 'POST',
      headers: combineHeaders(),
      body: JSON.stringify({ refresh: refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user (client-side only)
 * Removes tokens from localStorage
 */
export const logoutUser = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  // Add any other cleanup needed
};

// Export all authentication functions
export default {
  loginUser,
  registerUser,
  forgotPassword,
  validateResetToken,
  resetPassword,
  changePassword,
  verifyEmail,
  refreshToken,
  logoutUser,
   getUserProfile,
  updateUserProfile,
  changeUserPassword,
  deleteProfilePicture,
};