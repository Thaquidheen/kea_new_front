import axios from 'axios';
import { combineHeaders } from './config';
import { Api } from './apiurl';

// FIXED: Remove trailing slash to prevent double slashes
const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

// Helper function to clean URLs and prevent double slashes
const cleanUrl = (baseUrl, endpoint) => {
  // Remove trailing slash from base URL
  const cleanBase = baseUrl.replace(/\/+$/, '');
  // Ensure endpoint starts with single slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
  // Combine and remove any accidental double slashes
  const fullUrl = (cleanBase + cleanEndpoint).replace(/([^:]\/)\/+/g, '$1');
  return fullUrl;
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

/**
 * Get user details by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User details
 */
export const getUserDetails = async (userId) => {
  try {
    console.log('🔍 BASE_URL:', BASE_URL);
    console.log('🔍 Getting user details for:', userId);
    
    // FIXED: Use cleanUrl to construct proper URL
    const url = cleanUrl(BASE_URL, '/auth/userdetail/');
    console.log('🔗 Constructed URL:', url);
    
    const response = await axios.get(url, {
      params: { user_id: userId },
      headers: getAuthHeaders()
    });
    
    console.log('✅ User details fetched successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching user details:', error);
    throw error;
  }
};

/**
 * Generate a membership card
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Response data
 */
export const generateMembershipCard = async (userId) => {
  try {
    console.log('Generating membership card for user ID:', userId);
    
    // Basic validation
    if (!userId) {
      const error = new Error('User ID is required for membership card generation');
      console.error(error);
      throw error;
    }
    
    // FIXED: Use cleanUrl to prevent double slashes
    const url = cleanUrl(BASE_URL, '/auth/generate-membership-card/');
    console.log('🔗 Generate card URL:', url);
    
    const response = await axios.post(
      url,
      { user_id: userId },
      { 
        headers: combineHeaders(),
        timeout: 30000 // 30 second timeout
      }
    );
    
    console.log('Membership card generated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error generating membership card:', error);
    
    // Better error logging
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    throw error;
  }
};

/**
 * Regenerate a membership card
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Response data
 */
export const regenerateMembershipCard = async (userId, onProgress) => {
  try {
    console.log('🔄 Regenerating membership card for user:', userId);
    
    // Call progress callback if provided
    if (onProgress) {
      onProgress({ status: 'started', message: 'Initiating card generation...' });
    }
    
    // FIXED: Use cleanUrl to prevent double slashes
    const url = cleanUrl(BASE_URL, '/auth/regenerate-membership-card/');
    console.log('🔗 Regenerate card URL:', url);
    
    const response = await axios.post(
      url,
      { user_id: userId },
      {
        headers: getAuthHeaders(),
        timeout: 120000, // Increased to 2 minutes
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress({ 
              status: 'uploading', 
              progress: percentCompleted,
              message: 'Uploading data...'
            });
          }
        },
        onDownloadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress({ 
              status: 'processing', 
              progress: percentCompleted,
              message: 'Processing your card...'
            });
          }
        }
      }
    );

    console.log('✅ Membership card regenerated successfully');
    return response.data;
    
  } catch (error) {
    console.error('❌ Regenerate membership card error:', error);
    
    // Specific handling for timeout errors
    if (error.code === 'ECONNABORTED') {
      throw {
        message: 'The server is taking too long to generate your card. Please try again in a few moments.',
        isTimeout: true,
        originalError: error
      };
    }
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    throw error;
  }
};

/**
 * Send membership card to email
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Response data
 */
export const sendMembershipCardEmail = async (userId) => {
  try {
    // FIXED: Use cleanUrl to prevent double slashes
    const url = cleanUrl(BASE_URL, '/auth/send-membership-card-email/');
    console.log('🔗 Send email URL:', url);
    
    const response = await axios.post(
      url,
      { user_id: userId },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending membership card email:', error);
    throw error;
  }
};

/**
 * Get membership card view URL
 * @param {string} userId - User ID
 * @returns {string} - View URL
 */
export const getMembershipCardViewUrl = (userId) => {
  // FIXED: Use cleanUrl to prevent double slashes
  const url = cleanUrl(BASE_URL, `auth/view-card/${userId}/`);
  console.log('🔗 View card URL:', url);
  return url;
};

/**
 * Get membership card download URL
 * @param {string} userId - User ID
 * @returns {string} - Download URL
 */
export const getMembershipCardDownloadUrl = (userId) => {
  if (!userId) return null;
  
  // FIXED: Use BASE_URL consistently and prevent double slashes
  const baseUrl = BASE_URL; // Use BASE_URL instead of Api
  const timestamp = Date.now(); // Add timestamp to prevent caching
  
  const url = cleanUrl(baseUrl, `/auth/download-membership-card/${userId}/?t=${timestamp}`);
  console.log('🔗 Download card URL:', url);
  return url;
};

/**
 * Download membership card (triggers browser download)
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const downloadMembershipCard = async (userId) => {
  try {
    const downloadUrl = getMembershipCardDownloadUrl(userId);
    console.log('🔗 Downloading from:', downloadUrl);
    
    const response = await axios.get(downloadUrl, {
      // headers: getAuthHeaders(), // Uncomment if auth is required
      responseType: 'blob' // Important for file downloads
    });
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `KEA_Membership_Card_${userId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    console.log('✅ Membership card downloaded successfully');
  } catch (error) {
    console.error('Error downloading membership card:', error);
    throw error;
  }
};

// BONUS: Add a debug function to test URL construction
export const debugUrls = (userId = 'test-user-id') => {
  console.log('=== URL DEBUG INFO ===');
  console.log('BASE_URL:', BASE_URL);
  console.log('Generate card:', cleanUrl(BASE_URL, '/auth/generate-membership-card/'));
  console.log('View card:', cleanUrl(BASE_URL, `/auth/view-card/${userId}/`));
  console.log('Download card:', cleanUrl(BASE_URL, `/auth/download-membership-card/${userId}/`));
  console.log('User details:', cleanUrl(BASE_URL, '/auth/userdetail/'));
  console.log('=====================');
};

// Export all functions as a default object
export default {
  getUserDetails,
  generateMembershipCard,
  regenerateMembershipCard,
  sendMembershipCardEmail,
  downloadMembershipCard,
  getMembershipCardViewUrl,
  getMembershipCardDownloadUrl,
  debugUrls, // Added debug function
};