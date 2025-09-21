// src/api/EventCheckInApi.js
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

/**

 * @param {string} userId 
 * @param {string} eventId 
 * @returns {Promise<Object>}
 */
/**
 * Send QR code data to the backend for verification
 * @param {string} qrData - The QR code data or user ID
 * @param {string} eventId - The event ID
 * @returns {Promise<Object>} - The verification result
 */
export const scanQRForEventCheckIn = async (qrData, eventId) => {
  try {
    console.log("Sending scan request:", { qrData: qrData.substring(0, 30) + "...", eventId });
    
    const response = await fetch(`${BASE_URL}/program/scan-qr-event-checkin/`, {
      method: 'POST',
     
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}` 
      },
      body: JSON.stringify({
        qr_data: qrData,
        event_id: eventId
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error response:", errorData);
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    const result = await response.json();
    console.log("API success response:", result);
    return result;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};
/**
 * Confirm user check-in for event
 * @param {string} registrationId - Registration ID
 * @returns {Promise<Object>} - Check-in confirmation
 */
export const confirmEventCheckIn = async (registrationId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/program/confirm-event-checkin/`,
      { registration_id: registrationId },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error confirming event check-in:', error);
    throw error;
  }
};

/**
 * Get event attendance list
 * @param {string} eventId - Event ID
 * @returns {Promise<Object>} - Event attendance data
 */
export const getEventAttendance = async (eventId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/program/event-attendance/${eventId}/`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching event attendance:', error);
    throw error;
  }
};

/**
 * Get user QR information
 * @returns {Promise<Object>} - User QR and membership info
 */
export const getUserQRInfo = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/program/get-user-qr-info/`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user QR info:', error);
    throw error;
  }
};

/**
 * Get all events list
 * @returns {Promise<Object>} - Events list
 */
export const getEventsList = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/program/events/`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching events list:', error);
    throw error;
  }
};

/**
 * Check if user is registered for an event
 * @param {string} eventId - Event ID
 * @returns {Promise<Object>} - Registration status
 */
export const checkEventRegistration = async (eventId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/program/check-registration/`,
      { event_id: eventId },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error checking event registration:', error);
    throw error;
  }
};

/**
 * Verify user event registration (existing API)
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User registration details
 */
export const verifyUserEventRegistration = async (userId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/program/verify-user-event-registration/`,
      { user_id: userId },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error verifying user event registration:', error);
    throw error;
  }
};

export default {
  scanQRForEventCheckIn,
  confirmEventCheckIn,
  getEventAttendance,
  getUserQRInfo,
  getEventsList,
  checkEventRegistration,
  verifyUserEventRegistration
};