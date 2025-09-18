import React, { useEffect, useState } from "react";
import { FiCamera, FiUpload, FiCheckCircle, FiAlertTriangle, FiXCircle, FiRefreshCw, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { useNotification } from "../../contexts/NotificationContext";

export const StepOne = ({
  formData,
  handleChange,
  handleFileChange: parentHandleFileChange,
  handleToggleCamera,
  useCamera,
  webcamRef,
  handleCapturePhoto,
  onFaceDetectionUpdate,
}) => {
  const [faceDetected, setFaceDetected] = useState(false);
  const [previewImage, setPreviewImage] = useState(formData.selfieImage || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isValid: false
  });
  
  // Get notification functions - with fallback to console.log if not available
  const notificationContext = useNotification();
  const { success, error, info, warning } = notificationContext || {};
  
  // Create fallback functions if notification context is not available
  const safeSuccess = success || ((msg) => console.log('SUCCESS:', msg));
  const safeError = error || ((msg) => console.error('ERROR:', msg));
  const safeInfo = info || ((msg) => console.log('INFO:', msg));
  const safeWarning = warning || ((msg) => console.warn('WARNING:', msg));
  
  // Update preview when formData changes
  useEffect(() => {
    if (formData.selfieImage) {
      setPreviewImage(formData.selfieImage);
    }
  }, [formData.selfieImage]);
  
  // Load face detection models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      } catch (err) {
        safeError("Some features may be limited.");
      }
    };
    loadModels();
  }, [safeError]);
  
  // Check existing photo for face detection on component load
  useEffect(() => {
    // If there's already a selfie image and face detection hasn't been checked yet
    if (formData.selfieImage && !faceDetected) {
      const img = new Image();
      img.src = formData.selfieImage;
      
      img.onload = async () => {
        try {
          const detection = await faceapi.detectSingleFace(
            img,
            new faceapi.TinyFaceDetectorOptions()
          );
          
          if (detection) {
            setFaceDetected(true);
            onFaceDetectionUpdate?.(true); // Notify parent
            console.log("Existing photo verified on component load");
          } else {
            setFaceDetected(false);
            onFaceDetectionUpdate?.(false); // Notify parent
          }
        } catch (error) {
          console.error("Face detection error on load:", error);
          setFaceDetected(false);
          onFaceDetectionUpdate?.(false); // Notify parent
        }
      };
    }
  }, [formData.selfieImage, faceDetected, onFaceDetectionUpdate]);
  
  // Password validation
  const validatePassword = (password) => {
    const validation = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password)
    };
    
    validation.isValid = Object.values(validation).every(Boolean);
    return validation;
  };
  
  // Enhanced change handler to include password validation
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'password') {
      const validation = validatePassword(value);
      setPasswordValidation(validation);
    }
    
    // Call the parent change handler
    handleChange(e);
  };
  
  // Check if user can proceed to next step
  const canProceedToNextStep = () => {
    return (
      formData.first_name &&
      formData.last_name &&
      formData.email &&
      passwordValidation.isValid &&
      formData.password === formData.confirmPassword &&
      faceDetected && // Photo must be verified
      (formData.photoFile || formData.selfieImage) // Photo must exist
    );
  };
  
  // Reset photo function
  const handleResetPhoto = () => {
    setPreviewImage(null);
    setFaceDetected(false);
    onFaceDetectionUpdate?.(false); // Notify parent
    
    // If using parent state
    if (handleCapturePhoto) {
      handleCapturePhoto(null);
    }
  };
  
  // Retry camera function
  const handleRetakePhoto = () => {
    handleToggleCamera();
    setPreviewImage(null);
    setFaceDetected(false);
    onFaceDetectionUpdate?.(false); // Notify parent
  };
  
  // Enhanced file change handler with safe notification functions
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        safeError("Please select a valid image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        safeError("Image size exceeds 5MB limit. Please select a smaller image.");
        return;
      }
      
      setIsProcessing(true);
      safeInfo(`Processing image: ${file.name}`);
      
      // Create preview for immediate feedback
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageUrl = event.target.result;
        setPreviewImage(imageUrl);
        
        // Process face detection
        const img = new Image();
        img.src = imageUrl;
        
        img.onload = async () => {
          try {
            const detection = await faceapi.detectSingleFace(
              img,
              new faceapi.TinyFaceDetectorOptions()
            );
            
            if (detection) {
              setFaceDetected(true);
              onFaceDetectionUpdate?.(true); // Notify parent
              safeSuccess("Face detected and verified in photo!");
            } else {
              setFaceDetected(false);
              onFaceDetectionUpdate?.(false); // Notify parent
              safeWarning("No face detected in the photo. Please upload a clear photo with your face visible.");
            }
            setIsProcessing(false);
          } catch (error) {
            console.error("Face detection error:", error);
            setFaceDetected(false);
            onFaceDetectionUpdate?.(false); // Notify parent
            safeError("Error processing face detection. Please try another photo.");
            setIsProcessing(false);
          }
        };
      };
      reader.readAsDataURL(file);
      
      // Call the parent handler
      parentHandleFileChange(e);
    }
  };

  const handleCapture = async () => {
    if (webcamRef.current) {
      setIsProcessing(true);
      safeInfo("Capturing photo...");
      
      const imageSrc = webcamRef.current.getScreenshot();
  
      if (!imageSrc) {
        safeError("Could not capture image, please try again.");
        setIsProcessing(false);
        return;
      }
      
      // Update preview immediately
      setPreviewImage(imageSrc);
  
      const img = new Image();
      img.src = imageSrc;
  
      img.onload = async () => {
        try {
          const detection = await faceapi.detectSingleFace(
            img,
            new faceapi.TinyFaceDetectorOptions()
          );
    
          if (detection) {
            setFaceDetected(true);
            handleCapturePhoto(imageSrc);
            onFaceDetectionUpdate?.(true); // Notify parent
            safeSuccess("Photo captured and face verified successfully!");
          } else {
            setFaceDetected(false);
            handleCapturePhoto(imageSrc);
            onFaceDetectionUpdate?.(false); // Notify parent
            safeWarning("No face detected in the captured photo. Please retake with your face clearly visible.");
          }
          handleToggleCamera();  // close webcam view
          setIsProcessing(false);
        } catch (err) {
          safeError("Error processing face detection. Please try again.");
          setIsProcessing(false);
        }
      };
  
      img.onerror = () => {
        safeError("Failed to load captured image.");
        setIsProcessing(false);
      };
    }
  };
  
  return (
    <div className="form-step">
      <h3><FiUser className="step-icon" /> Basic Details</h3>

      <div className="form-group">
        <label htmlFor="first_name">First Name *</label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="Enter your first name"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="last_name">Last Name *</label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Enter your last name"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter Email"
          autoComplete="email"
          required
        />
      </div>

      <div className="form-group photo-upload-section">
        <label>
          Add Profile Photo 
          <span className="required-indicator"> *</span>
        </label>
        <small className="field-help">A clear photo with your face is required to proceed</small>
        
        {!previewImage && !useCamera && (
          <div className="photo-options">
            <input
              id="photoFile"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <label htmlFor="photoFile" className="photo-btn">
              <FiUpload size={16} /> Upload from File
            </label>

            <button 
              type="button" 
              className={`photo-btn camera-btn ${useCamera ? 'active' : ''}`}
              onClick={handleToggleCamera}
            >
              <FiCamera size={16} /> Use Camera
            </button>
          </div>
        )}

        {useCamera && (
          <div className="camera-section">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="webcam-view"
            />
            <div className="camera-controls">
              <button 
                type="button" 
                className="photo-btn capture-btn" 
                onClick={handleCapture}
                disabled={isProcessing}
              >
                <FiCamera size={16} /> {isProcessing ? 'Processing...' : 'Capture Photo'}
              </button>
              <button 
                type="button" 
                className="photo-btn cancel-btn" 
                onClick={handleToggleCamera}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {previewImage && (
          <div className="photo-preview">
            <img src={previewImage} alt="Profile preview" className="preview-image" />
            <div className="photo-status">
              {isProcessing ? (
                <div className="processing-status">
                  <FiRefreshCw className="spin" size={16} />
                  <span>Processing...</span>
                </div>
              ) : faceDetected ? (
                <div className="verification-status verified">
                  <FiCheckCircle size={16} />
                  <span>Face verified</span>
                </div>
              ) : (
                <div className="verification-status not-verified">
                  <FiXCircle size={16} />
                  <span>No face detected</span>
                </div>
              )}
            </div>
            <div className="photo-actions">
              <button 
                type="button" 
                className="photo-btn retry-btn" 
                onClick={handleRetakePhoto}
              >
                <FiRefreshCw size={16} /> Retake
              </button>
              <button 
                type="button" 
                className="photo-btn reset-btn" 
                onClick={handleResetPhoto}
              >
                <FiXCircle size={16} /> Remove
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password *</label>
        <div className="password-input-container">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handlePasswordChange}
            placeholder="Enter Password"
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        </div>
        
        {formData.password && (
          <div className="password-requirements">
            <div className={`requirement ${passwordValidation.minLength ? 'valid' : 'invalid'}`}>
              <span className="requirement-icon">{passwordValidation.minLength ? '✓' : '×'}</span>
              At least 8 characters
            </div>
            <div className={`requirement ${passwordValidation.hasUppercase ? 'valid' : 'invalid'}`}>
              <span className="requirement-icon">{passwordValidation.hasUppercase ? '✓' : '×'}</span>
              One uppercase letter
            </div>
            <div className={`requirement ${passwordValidation.hasLowercase ? 'valid' : 'invalid'}`}>
              <span className="requirement-icon">{passwordValidation.hasLowercase ? '✓' : '×'}</span>
              One lowercase letter
            </div>
            <div className={`requirement ${passwordValidation.hasNumber ? 'valid' : 'invalid'}`}>
              <span className="requirement-icon">{passwordValidation.hasNumber ? '✓' : '×'}</span>
              One number
            </div>
            <div className={`requirement ${passwordValidation.hasSpecialChar ? 'valid' : 'invalid'}`}>
              <span className="requirement-icon">{passwordValidation.hasSpecialChar ? '✓' : '×'}</span>
              One special character
            </div>
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password *</label>
        <div className="password-input-container">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        </div>
        
        {formData.confirmPassword && (
          <div className={`password-match ${formData.password === formData.confirmPassword ? 'valid' : 'invalid'}`}>
            <span className="requirement-icon">
              {formData.password === formData.confirmPassword ? '✓' : '×'}
            </span>
            {formData.password === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
          </div>
        )}
      </div>

      {/* Step completion indicator */}
      <div className="step-completion-status">
        <div className={`completion-item ${formData.first_name ? 'completed' : ''}`}>
          <span className="completion-icon">{formData.first_name ? '✓' : '○'}</span>
          First Name
        </div>
        <div className={`completion-item ${formData.last_name ? 'completed' : ''}`}>
          <span className="completion-icon">{formData.last_name ? '✓' : '○'}</span>
          Last Name
        </div>
        <div className={`completion-item ${formData.email ? 'completed' : ''}`}>
          <span className="completion-icon">{formData.email ? '✓' : '○'}</span>
          Email
        </div>
        <div className={`completion-item ${passwordValidation.isValid ? 'completed' : ''}`}>
          <span className="completion-icon">{passwordValidation.isValid ? '✓' : '○'}</span>
          Strong Password
        </div>
        <div className={`completion-item ${formData.password === formData.confirmPassword && formData.confirmPassword ? 'completed' : ''}`}>
          <span className="completion-icon">{formData.password === formData.confirmPassword && formData.confirmPassword ? '✓' : '○'}</span>
          Password Confirmation
        </div>
        <div className={`completion-item ${faceDetected ? 'completed' : ''}`}>
          <span className="completion-icon">{faceDetected ? '✓' : '○'}</span>
          Face Verified Photo
        </div>
      </div>

      {/* Progress indicator */}
      {!canProceedToNextStep() && (
        <div className="step-requirements-alert">
          <FiAlertTriangle size={16} />
          <span>Complete all requirements above to proceed to the next step</span>
        </div>
      )}
    </div>
  );
};

// Export the validation function for use in parent component
export const validateStepOne = (formData, faceDetected) => {
  const passwordValidation = {
    minLength: formData.password?.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password || ''),
    hasLowercase: /[a-z]/.test(formData.password || ''),
    hasNumber: /\d/.test(formData.password || ''),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(formData.password || '')
  };
  
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  
  return {
    isValid: !!(
      formData.first_name &&
      formData.last_name &&
      formData.email &&
      isPasswordValid &&
      formData.password === formData.confirmPassword &&
      faceDetected &&
      (formData.photoFile || formData.selfieImage)
    ),
    errors: {
      firstName: !formData.first_name,
      lastName: !formData.last_name,
      email: !formData.email,
      password: !isPasswordValid,
      confirmPassword: formData.password !== formData.confirmPassword,
      photo: !faceDetected || (!formData.photoFile && !formData.selfieImage)
    }
  };
};