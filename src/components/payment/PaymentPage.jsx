// src/pages/PaymentPage/PaymentPage.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { createMembershipOrder, verifyPayment, initializeRazorpay } from '../../api/PaymentApi';
import './PaymentPage.css';
import { useNotification } from '../../contexts/NotificationContext';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State variables
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const { success, error: showError, info } = useNotification();

  // Process location state for user info or get from localStorage
  useEffect(() => {
    const getUserInfo = () => {
      // First try to get from location state
      if (location.state?.userId && location.state?.userName) {
        info('User information loaded from navigation');
        return {
          userId: location.state.userId,
          userName: location.state.userName
        };
      }
      
      // If not in location state, try localStorage
      try {
        const userString = localStorage.getItem('user');
        if (userString) {
          const userObj = JSON.parse(userString);
          if (userObj.user_id) {
            info('User information loaded from session');
            return {
              userId: userObj.user_id,
              userName: userObj.username || 'KEA Member'
            };
          }
        }
      } catch (err) {
        console.error('Error parsing user data:', err);
        showError('Error loading user data from session');
      }
      
      // No user info found
      showError('User information not found. Please log in to continue.');
      return null;
    };
    
    const user = getUserInfo();
    setUserInfo(user);
  }, [location.state]);
  
  // Membership benefits and features
  const membershipBenefits = [
    'Access to exclusive engineering webinars and workshops',
    'Networking opportunities with leading professionals',
    'Monthly technical newsletters and industry updates',
    'Discounted entry to KEA conferences and events',
    'Access to job postings and career advancement resources',
    'Participation in community service and outreach programs',
    'Digital membership card and certificate',
    'Voting rights in KEA elections'
  ];
  
  // Handle payment initiation
  const handlePaymentStart = async () => {
    if (!userInfo?.userId) {
      setError('User information not available. Please log in again.');
      showError('User information not available. Please log in again.');
      return;
    }
    
    setLoading(true);
    setError('');
    info('Initiating payment process...');
    
    try {
      // Create Razorpay order
      info('Creating payment order...');
      const orderData = await createMembershipOrder(userInfo.userId);
      success('Payment order created successfully');
      
      // Initialize Razorpay with callbacks
      const rzp = initializeRazorpay(orderData, {
        handler: async function(response) {
          try {
            setLoading(true);
            info('Verifying payment...');
            // Verify the payment
            const result = await verifyPayment(response);
            
            // Show success message and redirect
            success('Payment successful! Your membership is now active.');
            info('Redirecting to dashboard...');
            navigate('/dashboard');
          } catch (err) {
            setError(err.message || 'Payment verification failed. Please contact support.');
            showError(err.message || 'Payment verification failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: userInfo.userName,
          email: userInfo.email || '',
        },
        modal: {
          ondismiss: function() {
            info('Payment cancelled by user');
            setLoading(false);
          }
        }
      });
      
      // Open Razorpay payment window
      info('Opening payment gateway...');
      rzp.open();
      
      // Handle payment failures
      rzp.on('payment.failed', function(response) {
        setError(`Payment failed: ${response.error.description || 'Unknown error'}`);
        showError(`Payment failed: ${response.error.description || 'Unknown error'}`);
        setLoading(false);
      });
      
    } catch (err) {
      setError(err.message || 'Failed to initiate payment. Please try again.');
      showError(err.message || 'Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };
  
  return (
    <div className="payment-page">
      <header className="page-header">
        <div className="content">
          <h1 className="page-title">Kerala Engineers' Association</h1>
          <p className="page-subtitle">Empowering Engineers Across Kerala Since 1985</p>
        </div>
      </header>
      
      <main className="main-container">
        <div className="payment-card">
          <div className="payment-header">
            <h2 className="payment-title">Membership Subscription</h2>
          </div>
          
          <div className="payment-content">
            {userInfo ? (
              <>
                <p className="welcome-message">
                  Welcome, <span className="user-name">{userInfo.userName}</span>! You're about to join a community of passionate engineers dedicated to excellence.
                </p>
                
                <p className="membership-description">
                  Your KEA membership gives you access to a wealth of resources, events, and networking opportunities. 
                  The annual fee is <span className="price-highlight">₹200</span>, valid for one full year from activation.
                </p>
                
                <div className="benefits-section">
                  <h3 className="benefits-title">Membership Benefits</h3>
                  <ul className="benefits-list">
                    {membershipBenefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="payment-info">
                  <h4 className="payment-info-title">Payment Information</h4>
                  <p>You'll be redirected to our secure payment partner, Razorpay, to complete your transaction. All payment data is encrypted and secure.</p>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <div className="payment-button-container">
                  <button 
                    className="payment-button"
                    onClick={handlePaymentStart}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Pay Now - ₹200 for 1 Year'}
                  </button>
                </div>
              </>
            ) : (
              <div className="error-message">
                <p>
                  <strong>User information not found.</strong> Please log in to continue with your membership payment.
                  <Link to="/login" className="login-link">Go to Login</Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;