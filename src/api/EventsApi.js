

import { API_ENDPOINTS, combineHeaders } from './config';

/**
 * @param {number} limit 
 * @returns {Promise<Array>}
 */
export const getFeaturedEvents = async (limit = 3) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.EVENT.LIST}?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * @returns {Promise<Array>} 
 */
export const getAllEvents = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(API_ENDPOINTS.EVENT.LIST, {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**

 * @param {string|number} eventId - Event ID
 * @returns {Promise<Object>} - Registration status
 */
export const checkEventRegistration = async (eventId) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(API_ENDPOINTS.EVENT.CHECK_REGISTRATION, {
      method: 'POST',
      headers: combineHeaders(),
      body: JSON.stringify({ event_id: eventId })
    });

    if (!response.ok) {
      throw new Error('Failed to check registration status');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**

 * @param {string|number} eventId 
 * @returns {Promise<Object>} 
 */
export const createEventPaymentOrder = async (eventId) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(API_ENDPOINTS.EVENT.CREATE_PAYMENT_ORDER, {
      method: 'POST',
      headers: combineHeaders(),
      body: JSON.stringify({ event_id: eventId })
    });

    if (!response.ok) {
      throw new Error('Error creating payment order');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**

 * @param {Object} registrationData 
 * @returns {Promise<Object>} 
 */
export const completeEventRegistration = async (registrationData) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(API_ENDPOINTS.EVENT.REGISTER, {
      method: 'POST',
      headers: combineHeaders(),
      body: JSON.stringify(registrationData)
    });

    if (!response.ok) {
      throw new Error('Payment succeeded, but registration failed');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**

 * @param {string|number} eventId 
 * @returns {Promise<Object>} 
 */
export const getEventById = async (eventId) => {
  try {
    const response = await fetch(API_ENDPOINTS.EVENT.DETAIL(eventId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch event details: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
/**

 * @param {string|number} eventId 
 * @returns {Promise<Object>} 
 */
export const registerForEventSimple = async (eventId) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(API_ENDPOINTS.EVENT.SIMPLE_REGISTRATION, {
      method: 'POST',
      headers: combineHeaders(),
      body: JSON.stringify({ event: eventId })
    });

    if (!response.ok) {
      throw new Error('Failed to register for event');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 
 * @param {Object} orderData 
 * @param {Object} event 
 * @param {Object} userData 
 * @param {Function} onSuccess 
 * @param {Function} onError 
 */
export const initiateEventPayment = (orderData, event, userData, onSuccess, onError) => {
  try {
    const options = {
      key: orderData.razorpay_key,
      amount: orderData.amount * 100,
      currency: orderData.currency,
      name: event.event_name,
      description: "Event Registration Fee",
      order_id: orderData.order_id,
      handler: function (response) {
        if (onSuccess) onSuccess(response);
      },
      prefill: {
        email: userData?.email || '',
        name: userData?.name || '',
      },
      theme: {
        color: "#267540", // Using accent green color
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    rzp.on('payment.failed', function (resp) {
      if (onError) onError(resp.error.description);
    });

    return rzp;
  } catch (error) {
    if (onError) onError(error.message);
    return null;
  }
};

export default {
  getFeaturedEvents,
  checkEventRegistration,
  createEventPaymentOrder,
  completeEventRegistration,
  initiateEventPayment,
  registerForEventSimple,
  getEventById,
  getAllEvents
};