import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PasswordReset.css';
import { resetPassword, validateResetToken } from '../../api/AuthApi';
import { useNotification } from '../../contexts/NotificationContext';

const PasswordReset = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(null);
  const { success, error: showError, info } = useNotification();

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setTokenValid(false);
        setError('No reset token provided in URL.');
        showError('No reset token provided in URL.');
        return;
      }
      
      console.log('🔍 Starting token validation...');
      info('Validating your reset link...');
      
      try {
        // Use the validateResetToken function from AuthApi
        const result = await validateResetToken(token);
        
        if (result.valid) {
          setTokenValid(true);
          success('Reset link is valid! You can now set your new password.');
        } else {
          setTokenValid(false);
          setError(result.message || 'This password reset link is invalid or has expired.');
          showError(result.message || 'This password reset link is invalid or has expired.');
        }
      } catch (err) {
        console.error('❌ Token validation error:', err);
        setTokenValid(false);
        
        // Handle error response
        if (err.token && Array.isArray(err.token)) {
          setError(err.token[0]);
          showError(err.token[0]);
        } else if (err.message) {
          setError(err.message);
          showError(err.message);
        } else {
          setError('Unable to validate reset link. Please try again.');
          showError('Unable to validate reset link. Please try again.');
        }
      }
    };
    
    checkToken();
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      showError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      showError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');
    info('Resetting your password...');

    try {
      // Pass both password and confirmPassword to the API
      await resetPassword(token, formData.password, formData.confirmPassword);
      
      setMessage('Password reset successful! Redirecting to login...');
      success('Password reset successful! Redirecting to login...');
      info('You will be redirected to the login page in 3 seconds');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      // Handle various error formats from backend
      if (err.error) {
        setError(err.error);
        showError(err.error);
      } else if (err.token && Array.isArray(err.token)) {
        setError(err.token[0]);
        showError(err.token[0]);
      } else if (err.password && Array.isArray(err.password)) {
        setError(err.password[0]);
        showError(err.password[0]);
      } else if (err.confirm_password && Array.isArray(err.confirm_password)) {
        setError(err.confirm_password[0]);
        showError(err.confirm_password[0]);
      } else if (err.message) {
        setError(err.message);
        showError(err.message);
      } else if (typeof err === 'string') {
        setError(err);
        showError(err);
      } else {
        // If error is an object with field errors
        const errorMessages = Object.entries(err)
          .map(([field, messages]) => {
            if (Array.isArray(messages)) {
              return messages.join(' ');
            }
            return messages;
          })
          .filter(Boolean)
          .join(' ');
        
        setError(errorMessages || 'Password reset failed');
        showError(errorMessages || 'Password reset failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    info('Redirecting to login page...');
    navigate('/login');
  };

  const handleNavigateToForgotPassword = () => {
    info('Redirecting to request new reset link...');
    navigate('/forgot-password');
  };

  // Loading state while validating token
  if (tokenValid === null) {
    return (
      <div className="password-reset-page">
        <div className="password-reset-card">
          <div className="loading-container">
            <div className="spinner-ring"></div>
            <p className="loading-message">Validating reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (tokenValid === false) {
    return (
      <div className="password-reset-page">
        <div className="password-reset-card">
          <div className="invalid-token-container">
            <div className="invalid-token-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="invalid-token-title">Invalid Reset Link</h2>
            <p className="invalid-token-message">{error}</p>
            <button
              onClick={handleNavigateToForgotPassword}
              className="link-button"
            >
              Request a new password reset link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="password-reset-page">
      <div className="password-reset-card">
        <div className="auth-header">
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">Enter your new password to secure your account</p>
        </div>

        {message && (
          <div className="alert-success">
            <div className="alert-content">
              <div className="alert-icon alert-icon--success">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="alert-message alert-message--success">{message}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="alert-error">
            <div className="alert-content">
              <div className="alert-icon alert-icon--error">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="alert-message alert-message--error">{error}</p>
            </div>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="input-group">
              <label htmlFor="password" className="input-label">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="form-control"
                placeholder="Enter your new password"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword" className="input-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="form-control"
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength={8}
              />
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
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="secondary-actions">
          <button
            type="button"
            onClick={handleNavigateToLogin}
            className="btn-secondary"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;