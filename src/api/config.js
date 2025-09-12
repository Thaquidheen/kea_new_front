// src/api/config.js

// Determine the base URL based on the environment
let BASE_URL;

if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'https://web-production-c00c.up.railway.app';
} else {
  BASE_URL = 'http://127.0.0.1:8000';
}

// API Endpoints for all services
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login/password/`,
    REGISTER: `${BASE_URL}/auth/register/`,
    VERIFY_EMAIL: `${BASE_URL}/auth/verify-email/`,
    REFRESH_TOKEN: `${BASE_URL}/auth/token/refresh/`,
    FORGOT_PASSWORD: `${BASE_URL}/auth/password-reset/`,
    RESET_PASSWORD: `${BASE_URL}/auth/password-reset`,
    CHANGE_PASSWORD: `${BASE_URL}/auth/change-password/`,
    SEND_OTP: `${BASE_URL}/auth/send-otp/`,
    TEST_OTP: `${BASE_URL}/auth/test-otp/`,
    OTP_VERIFY: `${BASE_URL}/auth/otpverify/`,
  },
  
  // User endpoints

  USER: {               
    PROFILE: `${BASE_URL}/auth/user/profile/`,              // Fixed: This should match your Django URL
    UPDATE_PROFILE: `${BASE_URL}/auth/user/profile/`,       // Fixed: Same as PROFILE
    PROFILE_ME: `${BASE_URL}/auth/user/profile/me/`,        // Fixed: Added trailing slash
    CHANGE_PASSWORD: `${BASE_URL}/auth/user/profile/change-password/`,
    DELETE_PICTURE: `${BASE_URL}/auth/user/profile/delete-picture/`,
  },

  
  // Payment endpoints
  PAYMENT: {
    CREATE_ORDER: `${BASE_URL}/payment/create-order/`,
    VERIFY_PAYMENT: `${BASE_URL}/payment/verify/`,
    GET_PLANS: `${BASE_URL}/payment/plans/`,
    CREATE_RAZORPAY_ORDER: `${BASE_URL}/auth/create-razorpay-order/`,
    VERIFY_PAYMENT: `${BASE_URL}/auth/verify-payment/`,
  },
  
  // Membership endpoints
  MEMBERSHIP: {
    GENERATE_CARD: `${BASE_URL}/auth/generate-membership-card/`,
    REGENERATE_CARD: `${BASE_URL}/auth/regenerate-membership-card/`,
    SEND_CARD_EMAIL: `${BASE_URL}/auth/send-membership-card-email/`,
    DOWNLOAD_CARD: `${BASE_URL}/auth/download-membership-card/:userId/`,
    VIEW_CARD: `${BASE_URL}/auth/view-card/:userId/`,
  },
  
  // Event endpoints
  EVENT: {
    LIST: `${BASE_URL}/program/events/`,
    DETAIL: (id) => `${BASE_URL}/program/events/${id}/`,
    REGISTER: `${BASE_URL}/program/event-registrations/`,
    MY_EVENTS: `${BASE_URL}/program/my-events/`,
    CHECK_REGISTRATION: `${BASE_URL}/program/check-registration/`,
    CREATE_PAYMENT_ORDER: `${BASE_URL}/program/create-razorpay-order/`,
    SIMPLE_REGISTRATION: `${BASE_URL}/program/eventregistration/create/`,
  },
  
  // Verification endpoints
  VERIFICATION: {
    VERIFY_USER_EVENT: `${BASE_URL}/program/verify-user-event-registration/`,
  }
};

// Default headers for API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Get authorization header if user is logged in
export const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Combine default headers with auth header and any custom headers
export const combineHeaders = (customHeaders = {}) => {
  return {
    ...DEFAULT_HEADERS,
    ...getAuthHeader(),
    ...customHeaders
  };
};

export default {
  BASE_URL,
  API_ENDPOINTS,
  DEFAULT_HEADERS,
  getAuthHeader,
  combineHeaders
};