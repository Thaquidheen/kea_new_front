// src/utils/dateUtils.js

/**
 * Format date string to a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    console.error('Error formatting date:', e);
    return dateString;
  }
};

/**
 * Format time string
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted time
 */
export const formatTime = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    console.error('Error formatting time:', e);
    return '';
  }
};

export default {
  formatDate,
  formatTime
};