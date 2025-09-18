// MultiStepRegister.jsx - Clean implementation with first_name and last_name fields

import React, { useState, useRef, useEffect } from 'react';
import './MultiStepRegister.css';
import { StepOne } from './Step1';
import { StepTwo } from './Step2';
import { StepThree } from './Step3';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/AuthApi';
import { sendOTP, verifyOTP } from '../../api/OtpApi';
import { createRazorpayOrder, verifyPayment, initiateRazorpayCheckout } from '../../api/PaymentApi';
import { useNotification } from '../../contexts/NotificationContext';
import { validateStepOne } from './Step1';

function MultiStepRegister() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationId, setVerificationId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { success, error: showError, info } = useNotification();
  const [userId, setUserId] = useState(null);

  // Ref for scrolling to top
  const formTopRef = useRef(null);
  
  useEffect(() => {
    return () => {
      console.log("MultiStepRegister unmounted");
    };
  }, []);
  
  // Scroll to top when step changes
  useEffect(() => {
    if (formTopRef.current) {
      formTopRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }
  }, [currentStep]);
  
  const [formData, setFormData] = useState({
    // Basic Details
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    photoFile: null,
    selfieImage: null,
    // Contact Details
    companyName: '',
    designation: '',
    contactNo: '',
    whatsappNo: '',
    address: '',
    college_name: '',
    department_of_study: '',
    year_of_graduation: '',
    bloodGroup: '',
    // Verification
    otp: '',
    terms: false,
  });

  const [isContactVerified, setIsContactVerified] = useState(false);
  const webcamRef = useRef(null);
  const [useCamera, setUseCamera] = useState(false);
  const [isFaceDetected, setIsFaceDetected] = useState(false);

  // Change Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photoFile: e.target.files[0] }));
  };

  const handleToggleCamera = () => {
    setUseCamera((prev) => !prev);
  };

  const handleCapturePhoto = (imageSrc) => {
    setFormData((prev) => ({ ...prev, selfieImage: imageSrc }));
  };

  const handleFaceDetectionUpdate = (detected) => {
    setIsFaceDetected(detected);
  };
  
  // OTP Functions
  const handleSendOTP = async () => {
    if (!formData.contactNo) {
      setErrorMessage('Please enter your Contact No first.');
      showError('Please enter your Contact No first.');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const data = await sendOTP(formData.contactNo);
      console.log('OTP response:', data);
      
      if (data.verification_id) {
        setVerificationId(data.verification_id);
        success('OTP sent successfully! Please check your phone.');
      }
      
    } catch (error) {
      console.error('Error sending OTP:', error);
      
      const errorDetail = error.error || 'Failed to send OTP. Please try again.';
      setErrorMessage(errorDetail);
      showError(errorDetail);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      setErrorMessage('Please enter the OTP.');
      showError('Please enter the OTP.');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const payload = { 
        phone_number: formData.contactNo,
        otp: formData.otp
      };
      
      if (verificationId) {
        payload.verification_id = verificationId;
      }
      
      console.log('Verifying OTP with payload:', payload);
      await verifyOTP(payload);
      
      setIsContactVerified(true);
      success('Phone number verified successfully!');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      
      const errorDetail = error.error || 'Failed to verify OTP. Please try again.';
      setErrorMessage(errorDetail);
      showError(errorDetail);
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation functions
  const handleNext = () => {
    setErrorMessage('');
    
    if (currentStep === 1) {
      const validation = validateStepOne(formData, isFaceDetected);
      
      if (!validation.isValid) {
        const errorMessages = Object.values(validation.errors).filter(Boolean);
        const errorMsg = errorMessages.length > 0 
          ? errorMessages.join('. ') 
          : 'Please complete all required fields in Step 1.';
        
        setErrorMessage(errorMsg);
        showError(errorMsg);
        return;
      }
      
      if (!formData.first_name) {
        setErrorMessage('Please enter your first name.');
        showError('Please enter your first name.');
        return;
      }
      
      if (!formData.last_name) {
        setErrorMessage('Please enter your last name.');
        showError('Please enter your last name.');
        return;
      }
      
      if (!formData.email) {
        setErrorMessage('Please enter your email address.');
        showError('Please enter your email address.');
        return;
      }
      
      if (!formData.password || !formData.confirmPassword) {
        setErrorMessage('Please enter and confirm your password.');
        showError('Please enter and confirm your password.');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage('Passwords do not match. Please check and try again.');
        showError('Passwords do not match. Please check and try again.');
        return;
      }
      
      const passwordValidation = {
        minLength: formData.password.length >= 8,
        hasUppercase: /[A-Z]/.test(formData.password),
        hasLowercase: /[a-z]/.test(formData.password),
        hasNumber: /\d/.test(formData.password),
        hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/.test(formData.password)
      };
      
      const isPasswordValid = Object.values(passwordValidation).every(Boolean);
      
      if (!isPasswordValid) {
        setErrorMessage('Password does not meet the security requirements. Please check the requirements below the password field.');
        showError('Password does not meet the security requirements.');
        return;
      }
      
      if (!formData.photoFile && !formData.selfieImage) {
        setErrorMessage('Please upload or take a profile photo to continue.');
        showError('Please upload or take a profile photo to continue.');
        return;
      }
      
      if (!isFaceDetected) {
        setErrorMessage('Face verification is required. Please upload a clear photo where your face is visible.');
        showError('Face verification is required. Please upload a clear photo where your face is visible.');
        return;
      }
    }
    
    if (currentStep === 2) {
      if (!formData.contactNo) {
        setErrorMessage('Please fill out your Contact Number.');
        showError('Please fill out your Contact Number.');
        return;
      }
    }
    
    setCurrentStep((prev) => prev + 1);
    success(`Step ${currentStep} completed! Proceeding to next step.`);
  };

  const handleBack = () => {
    setErrorMessage('');
    setCurrentStep((prev) => prev - 1);
  };

  // Payment verification
  async function handlePaymentVerification(paymentResponse) {
    console.log('Starting payment verification with:', paymentResponse);
    setIsLoading(true);
    
    try {
      const verificationPayload = {
        ...paymentResponse,
        user_id: userId || paymentResponse.user_id
      };
      
      console.log('Payment verification payload:', verificationPayload);
      
      const responseData = await verifyPayment(verificationPayload);
      console.log('Payment verification successful:', responseData);
      
      // Update user ID if needed
      if (responseData.user_id && !userId) {
        console.log('Setting user ID from response:', responseData.user_id);
        setUserId(responseData.user_id);
      }
      
      // Success message with longer duration
      success('🎉 Payment verified successfully! Membership activated. You can generate your membership card from your profile.', 8000);
      
      // Scroll to top to ensure success message is visible on mobile
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Wait longer before navigating to ensure mobile users see the message
      setTimeout(() => {
        navigate('/login');
      }, 6000);
      
    } catch (error) {
      console.error('Payment verification failed:', error);
      
      const errorDetail = error.details || error.message || 'Payment verification failed';
      setErrorMessage(`Payment verification failed: ${errorDetail}`);
      showError(`Payment verification failed: ${errorDetail}`);
      
      setIsLoading(false);
    }
  }

  // Payment initiation
  async function handleInitiatePayment(userId) {
    console.log('Initiating payment for user:', userId);
    setIsLoading(true);
    
    try {
      if (userId) {
        setUserId(userId);
      }
      
      const orderData = await createRazorpayOrder(userId);
      console.log('Razorpay order created:', orderData);
      
      if (!orderData || !orderData.order_id) {
        throw new Error('Invalid order data received from server');
      }
      
      const orderWithUserId = {
        ...orderData,
        user_id: userId
      };
      
      initiateRazorpayCheckout(
        orderWithUserId,
        {
          fullName: `${formData.first_name} ${formData.last_name}`,
          email: formData.email,
          contactNo: formData.contactNo
        },
        // Success callback
        (response) => {
          console.log('Razorpay checkout successful, verifying payment...', response);
          
          const verificationPayload = {
            ...response,
            user_id: userId
          };
          
          handlePaymentVerification(verificationPayload);
        },
        // Error callback
        (errorMsg) => {
          console.error('Razorpay checkout failed:', errorMsg);
          setErrorMessage(`Payment failed: ${errorMsg}`);
          showError(`Payment failed: ${errorMsg}`);
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error('Payment initiation error:', error);
      const errorDetail = error.error || error.message || 'Could not create payment order';
      setErrorMessage(`Payment initiation failed: ${errorDetail}`);
      showError(`Payment initiation failed: ${errorDetail}`);
      setIsLoading(false);
    }
  }

  const generateUsername = (firstName, lastName, email) => {
    let fullName = `${firstName} ${lastName}`;
    let username = fullName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 30);

    if (username.length < 3) {
      const emailPrefix = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      username = emailPrefix.substring(0, 30);
    }

    return username;
  };

  // Registration function
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isContactVerified) {
      setErrorMessage('Please verify your contact number before proceeding.');
      showError('Please verify your contact number before proceeding.');
      return;
    }
    
    if (!formData.terms) {
      setErrorMessage('Please agree to the Terms and Conditions before proceeding.');
      showError('Please agree to the Terms and Conditions before proceeding.');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');

    try {
      let responseData;
      const hasProfilePicture = formData.photoFile || formData.selfieImage;
      
      const validUsername = generateUsername(formData.first_name, formData.last_name, formData.email);
      
      if (hasProfilePicture) {
        const formDataPayload = new FormData();
        
        formDataPayload.append('user_type', 'member');
        formDataPayload.append('username', validUsername);
        formDataPayload.append('email', formData.email);
        formDataPayload.append('phone_number', formData.contactNo);
        formDataPayload.append('company_name', formData.companyName || '');
        formDataPayload.append('designation', formData.designation || '');
        formDataPayload.append('address', formData.address || '');
        formDataPayload.append('blood_group', formData.bloodGroup || '');
        formDataPayload.append('first_name', formData.first_name || '');
        formDataPayload.append('last_name', formData.last_name || '');
        formDataPayload.append('college_name', formData.college_name || '');
        formDataPayload.append('department_of_study', formData.department_of_study || '');
        formDataPayload.append('year_of_graduation', formData.year_of_graduation || '');
        formDataPayload.append('password', formData.password);
        
        if (formData.photoFile) {
          formDataPayload.append('profile_picture', formData.photoFile);
        } else if (formData.selfieImage) {
          const response = await fetch(formData.selfieImage);
          const blob = await response.blob();
          const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
          formDataPayload.append('profile_picture', file);
        }
        
        responseData = await registerUser(formDataPayload);
        
      } else {
        const payload = {
          user_type: 'member',
          username: validUsername, 
          email: formData.email,
          phone_number: formData.contactNo,
          company_name: formData.companyName || '',
          designation: formData.designation || '',
          address: formData.address || '',
          blood_group: formData.bloodGroup || '',
          first_name: formData.first_name || '',
          last_name: formData.last_name || '',
          college_name: formData.college_name || '',
          department_of_study: formData.department_of_study || '',
          year_of_graduation: formData.year_of_graduation || '',
          password: formData.password
        };
        
        responseData = await registerUser(payload);
      }
      
      console.log('Registration successful:', responseData);
      
      if (!responseData || !responseData.user_id) {
        throw { message: 'Registration failed: Invalid response from server.' };
      }
      
      const userId = responseData.user_id; 
      setUserId(userId);
      success('Registration successful! Proceeding to payment...');
      
      // Go directly to payment
      handleInitiatePayment(userId);
      
    } catch (error) {
      console.error('Registration error:', error);
      const errorMsg = error.message || 'An unexpected error occurred during registration.';
      setErrorMessage('Registration failed: ' + errorMsg);
      showError('Registration failed: ' + errorMsg, 10000);
      setIsLoading(false);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      <div className={`step-circle ${currentStep >= 1 ? 'active' : ''}`}>1</div>
      <div className={`step-line ${currentStep > 1 ? 'active' : ''}`} />
      <div className={`step-circle ${currentStep >= 2 ? 'active' : ''}`}>2</div>
      <div className={`step-line ${currentStep > 2 ? 'active' : ''}`} />
      <div className={`step-circle ${currentStep === 3 ? 'active' : ''}`}>3</div>
    </div>
  );

  return (
    <div className="multistep-container">
      <div ref={formTopRef} className="scroll-target"></div>
      
      <div className="form-header">
        <h2>Sign Up</h2>
        <p>Already a Member? <a href="/login">Sign In</a></p>
      </div>
      
      {renderStepIndicator()}
      
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleRegister} className="multistep-form">
        {currentStep === 1 && (
          <StepOne 
            formData={formData} 
            webcamRef={webcamRef} 
            useCamera={useCamera}  
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleToggleCamera={handleToggleCamera}
            handleCapturePhoto={handleCapturePhoto} 
            onFaceDetectionUpdate={handleFaceDetectionUpdate}
          />
        )}
        
        {currentStep === 2 && (
          <StepTwo 
            formData={formData} 
            handleChange={handleChange}
          />
        )}
        
        {currentStep === 3 && (
          <StepThree 
            formData={formData} 
            handleChange={handleChange}
            handleSendOTP={handleSendOTP}
            handleVerifyOTP={handleVerifyOTP} 
            isContactVerified={isContactVerified}
            isLoading={isLoading}
            handleBack={handleBack}
            handleRegister={handleRegister}
          />
        )}

        <div className="form-navigation">
          {currentStep > 1 && (
            <button 
              type="button" 
              className="nav-button back" 
              onClick={handleBack}
              disabled={isLoading}
            >
              Back
            </button>
          )}
          
          {currentStep < 3 && (
            <button 
              type="button" 
              className="nav-button next" 
              onClick={handleNext}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Save & Continue'}
            </button>
          )}
          
          {currentStep === 3 && (
            <button 
              type="submit" 
              className="nav-button submit"
              disabled={isLoading || !isContactVerified || !formData.terms}
            >
              {isLoading ? 'Processing...' : 'Register'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default MultiStepRegister;