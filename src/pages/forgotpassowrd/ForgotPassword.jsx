import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';
import { forgotPassword } from '../../api/AuthApi';
import { useNotification } from '../../contexts/NotificationContext';

const ForgotPassword = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { success, error: showError, info } = useNotification();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = (email) => {
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!email.trim()) {
      setError('Email address is required');
      showError('Email address is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      showError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    info('Sending password reset email...');

    try {
      // Use the AuthApi forgotPassword function
      const data = await forgotPassword(email.trim().toLowerCase());
      setIsSubmitted(true);
      success('Password reset email sent successfully! Check your inbox.');
      console.log('✅ Password reset email sent successfully');
    } catch (err) {
      console.error('❌ Request error:', err);
      // Handle specific error messages from backend
      if (err.email && Array.isArray(err.email)) {
        setError(err.email[0]);
        showError(err.email[0]);
      } else if (err.error) {
        setError(err.error);
        showError(err.error);
      } else if (err.message) {
        setError(err.message);
        showError(err.message);
      } else {
        setError('Failed to send reset email. Please try again.');
        showError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setResendLoading(true);
    setError('');
    info('Resending password reset email...');

    try {
      // Use the AuthApi forgotPassword function
      await forgotPassword(email.trim().toLowerCase());
      success('Password reset email resent successfully!');
      console.log('✅ Password reset email resent successfully');
    } catch (err) {
      console.error('❌ Request error:', err);
      if (err.message) {
        setError(err.message);
        showError(err.message);
      } else {
        setError('Failed to resend email. Please try again.');
        showError('Failed to resend email. Please try again.');
      }
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToLogin = () => {
    info('Redirecting to login page...');
    navigate('/login');
  };

  const handleTryDifferentEmail = () => {
    setIsSubmitted(false);
    setEmail('');
    setError('');
    info('Ready to try with a different email address');
  };

  // Success state - show after email is submitted
  if (isSubmitted) {
    return (
      <div className="forgot-password-page">
        <div className="forgot-password-card">
          <div className="success-container">
            <div className="success-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            <h1 className="success-title">Check Your Email</h1>
            <p className="success-message">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>

            <div className="success-instructions">
              <h4>What to do next:</h4>
              <ul>
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the "Reset Password" link in the email</li>
                <li>Follow the instructions to create a new password</li>
                <li>The link will expire in 24 hours for security</li>
              </ul>
            </div>

            {error && (
              <div className="alert-error">
                <div className="alert-content">
                  <div className="alert-icon">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="alert-message">{error}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleResendEmail}
              disabled={resendLoading}
              className="btn-primary"
              style={{ marginBottom: '1rem' }}
            >
              {resendLoading ? (
                <>
                  <div className="button-spinner"></div>
                  Resending...
                </>
              ) : (
                'Resend Email'
              )}
            </button>

            <div className="secondary-actions">
              <button
                onClick={handleTryDifferentEmail}
                className="btn-secondary"
              >
                Try a different email address
              </button>
              <button
                onClick={handleBackToLogin}
                className="btn-secondary"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main forgot password form
  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <div className="forgot-header">
          <div className="forgot-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="forgot-title">Forgot Password?</h1>
          <p className="forgot-description">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {error && (
          <div className="alert-error">
            <div className="alert-content">
              <div className="alert-icon">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="alert-message">{error}</p>
            </div>
          </div>
        )}

        <form className="forgot-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email Address
            </label>
            <div className="input-with-icon">
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`form-control form-control--with-icon ${error ? 'error' : ''}`}
                placeholder="Enter your email address"
                value={email}
                onChange={handleEmailChange}
                disabled={loading}
              />
              <div className="input-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <>
                <div className="button-spinner"></div>
                Sending Reset Link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="secondary-actions">
          <button
            onClick={handleBackToLogin}
            className="btn-secondary"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;