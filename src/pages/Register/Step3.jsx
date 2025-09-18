import React, { useState, useEffect } from 'react';
import { FiSend, FiCheckCircle, FiShield, FiInfo, FiLock, FiFileText } from 'react-icons/fi';
import { useNotification } from '../../contexts/NotificationContext';

export const StepThree = ({
  formData,
  handleChange,
  handleSendOTP: parentHandleSendOTP,
  handleVerifyOTP: parentHandleVerifyOTP,
  isContactVerified,
  isLoading: parentIsLoading,
  handleBack,
  handleRegister
}) => {
  const { success, error, info } = useNotification();

  // Create separate loading states for each button
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Send OTP with notification feedback
  const handleSendOTP = async () => {
    if (isSendingOTP) return;
    
    setIsSendingOTP(true);
    
    try {
     
      
      await parentHandleSendOTP();
      
      
    } catch (err) {
     
    } finally {
      setIsSendingOTP(false);
    }
  };
  
  // Verify OTP with notification feedback
  const handleVerifyOTP = async () => {
    if (isVerifyingOTP) return;
    
    setIsVerifyingOTP(true);
    
    try {
      info("Verifying OTP...", 10000);
      
      await parentHandleVerifyOTP();
      
      if (isContactVerified) {
        success("Phone number verified successfully!", 8000);
      }
    } catch (err) {
      error(err.message || "Failed to verify OTP. Please try again.", 8000);
    } finally {
      setIsVerifyingOTP(false);
    }
  };
  
  // Handle the processing button
  const handleSubmit = async (e) => {
    if (isProcessing) return;
    e.preventDefault();
    
    setIsProcessing(true);
    try {
      await handleRegister(e);
      // The parent component will handle success/error notifications
    } catch (err) {
      setIsProcessing(false);
    }
  };
  


  return (
    <div className="form-step">
      <h3><FiLock size={18} className="step-icon" /> Verification</h3>
      
      <div className="verification-section">
        <div className="verification-info">
          <FiShield size={20} />
          <span>We need to verify your contact number before proceeding with registration.</span>
        </div>
        
        <div className="contact-display">
          <label>Contact Number:</label>
          <span className="contact-number">{formData.contactNo}</span>
          <button
            type="button"
            className={`otp-button ${isContactVerified ? 'otp-sent' : ''}`}
            onClick={handleSendOTP}
            disabled={isSendingOTP || isContactVerified}
          >
            {isSendingOTP ? (
              <span>Sending...</span>
            ) : isContactVerified ? (
              <span><FiCheckCircle size={16} /> Verified</span>
            ) : (
              <span><FiSend size={16} /> Send OTP</span>
            )}
          </button>
        </div>
        
        <div className="otp-input-container">
          <label htmlFor="otp">Enter OTP</label>
          <div className="otp-verification-row">
            <input
              id="otp"
              name="otp"
              type="text"
              value={formData.otp}
              onChange={handleChange}
              placeholder="Enter the 6-digit code"
              autoComplete="one-time-code"
              maxLength="6"
              disabled={isContactVerified}
              className={isContactVerified ? 'input-verified' : ''}
            />
            <button
              type="button"
              className={`otp-button verify-button ${isContactVerified ? 'button-verified' : ''}`}
              onClick={handleVerifyOTP}
              disabled={isVerifyingOTP || !formData.otp || isContactVerified}
            >
              {isVerifyingOTP ? 'Verifying...' : isContactVerified ? (
                <span><FiCheckCircle size={16} /> Verified</span>
              ) : 'Verify OTP'}
            </button>
          </div>
        </div>
        
        {isContactVerified && (
          <div className="verification-success">
            <p className="verified-text">Contact Verified</p>
            <p>Your phone number has been verified successfully. You can now proceed with registration.</p>
          </div>
        )}
        
        <div className="verification-note">
          <p><FiInfo size={14} /> You will receive an OTP on your provided contact number. This helps us verify your identity.</p>
        </div>
      </div>

      <div className="terms-agreement">
        <input
          type="checkbox"
          id="terms"
          name="terms"
          checked={formData.terms}
          onChange={(e) => handleChange({
            target: {
              name: 'terms',
              value: e.target.checked
            }
          })}
        />
        <label htmlFor="terms">
          <FiFileText size={14} style={{marginRight: '6px'}} />
          I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms and Conditions</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
        </label>
      </div>
    </div>
  );
};