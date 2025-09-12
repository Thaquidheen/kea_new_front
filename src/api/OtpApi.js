// src/api/OtpApi.js

import { API_ENDPOINTS, combineHeaders } from './config';
import axios from 'axios';

/**
 * Send OTP to user's phone number
 * @param {string} phoneNumber - User's phone number
 * @returns {Promise<Object>} - Contains verification_id and test_otp (in development)
 */
export const sendOTP = async (phoneNumber) => {
  try {
    const response = await axios.post(API_ENDPOINTS.AUTH.SEND_OTP, {
      phone_number: phoneNumber
    }, {
      headers: combineHeaders()
    });
    console.log(API_ENDPOINTS.AUTH.SEND_OTP)
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Try test OTP as fallback (for development)
 * @param {string} phoneNumber - User's phone number
 * @returns {Promise<Object>} - Contains verification_id and test_otp
 */
export const getTestOTP = async (phoneNumber) => {
  try {
    const response = await axios.post(API_ENDPOINTS.AUTH.TEST_OTP, {
      phone_number: phoneNumber
    }, {
      headers: combineHeaders()
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Verify OTP entered by user
 * @param {Object} data - Contains phone_number, otp, and verification_id
 * @returns {Promise<Object>} - Verification result
 */
export const verifyOTP = async (data) => {
  try {
    const response = await axios.post(API_ENDPOINTS.AUTH.OTP_VERIFY, data, {
      headers: combineHeaders()
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  sendOTP,
  getTestOTP,
  verifyOTP
};