import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getUserDetails, 
  generateMembershipCard, 
  sendMembershipCardEmail, 
  regenerateMembershipCard
} from '../../api/MembershipApi';

import './MembershipCard.css';
import PDFViewer from './PDFViewer';
import { Api } from '../../api/apiurl';
import { useNotification } from '../../contexts/NotificationContext';

const MembershipCard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('iframe');
  const [directViewUrl, setDirectViewUrl] = useState('');
  const [cardUrl, setCardUrl] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [infoExpanded, setInfoExpanded] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [cardExists, setCardExists] = useState(false);
  
  // Use refs to prevent multiple calls
  const isInitialized = useRef(false);
  const progressIntervalRef = useRef(null);
  const { success, error: showError, info } = useNotification();

  // Backend base URL
 const backendBaseUrl = Api || 'http://127.0.0.1:8000';

  // Progress bar simulation for card generation
  const simulateProgress = () => {
    setProgress(0);
    setIsGenerating(true);
    
    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
          return 95;
        }
        return prev + 5;
      });
    }, 200);
    
    return progressIntervalRef.current;
  };

  // Function to manually set progress to 100% and reset after delay
  const completeProgress = () => {
    setProgress(100);
    
    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    // Reset progress after animation completes
    setTimeout(() => {
      setProgress(0);
      setIsGenerating(false);
    }, 2000);
  };

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Get user ID from localStorage with improved parsing
  const getUserIdFromLocalStorage = () => {
    try {
      console.log('All localStorage keys:', Object.keys(localStorage));
      
      // Check all possible localStorage keys that might contain user data
      const possibleKeys = ['user', 'userData', 'auth', 'profile', 'currentUser', 'userInfo'];
      
      for (const key of possibleKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          console.log(`Checking ${key}:`, data);
          try {
            const parsed = JSON.parse(data);
            
            // Check all possible paths to user_id
            if (parsed.user_id) {
              console.log(`Found user_id in ${key}.user_id:`, parsed.user_id);
              return parsed.user_id;
            } 
            else if (parsed.id) {
              console.log(`Found id in ${key}.id:`, parsed.id);
              return parsed.id;
            }
            else if (parsed.user && parsed.user.user_id) {
              console.log(`Found user_id in ${key}.user.user_id:`, parsed.user.user_id);
              return parsed.user.user_id;
            }
            else if (parsed.user && parsed.user.id) {
              console.log(`Found id in ${key}.user.id:`, parsed.user.id);
              return parsed.user.id;
            }
            else if (parsed.data && parsed.data.user_id) {
              console.log(`Found user_id in ${key}.data.user_id:`, parsed.data.user_id);
              return parsed.data.user_id;
            }
            else if (parsed.data && parsed.data.id) {
              console.log(`Found id in ${key}.data.id:`, parsed.data.id);
              return parsed.data.id;
            }
            // Handle nested user objects
            else if (parsed.data && parsed.data.user && parsed.data.user.user_id) {
              console.log(`Found user_id in ${key}.data.user.user_id:`, parsed.data.user.user_id);
              return parsed.data.user.user_id;
            }
          } catch (e) {
            console.error(`Error parsing ${key} from localStorage:`, e);
          }
        }
      }
      
      // Last resort: check URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const userIdFromUrl = urlParams.get('user_id');
      if (userIdFromUrl) {
        console.log('Found user_id in URL parameters:', userIdFromUrl);
        return userIdFromUrl;
      }
      
      console.error('No user ID found in any localStorage key');
      return null;
    } catch (err) {
      console.error('Error getting user ID from localStorage:', err);
      return null;
    }
  };

  // Get userId using the improved function
  const userId = getUserIdFromLocalStorage();

  // Function to check if card exists (by calling generate API which checks existence)
  const checkAndFetchCard = async () => {
    try {
      console.log('Checking if membership card exists for user:', userId);
      
      // Call generate API - it will return existing card if it exists
      const result = await generateMembershipCard(userId);
      console.log('Card check result:', result);
      
      if (result.card_exists || result.membership_card_url) {
        // Card already exists
        setCardExists(true);
        
        let fullUrl = result.membership_card_url;
        if (!fullUrl.startsWith('http')) {
          fullUrl = `${backendBaseUrl}${fullUrl}`;
        }
        
        // Add timestamp to prevent caching
        fullUrl = `${fullUrl}?t=${Date.now()}`;
        
        setCardUrl(fullUrl);
        setDirectViewUrl(`${backendBaseUrl}/auth/view-card/${userId}/?t=${Date.now()}`);
        
        console.log('Existing card found and loaded');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking card existence:', error);
      return false;
    }
  };

  // Function to generate new card (only if needed)
  const generateNewCard = async () => {
    // Prevent multiple simultaneous generations
    if (isGenerating) {
      console.log('Card generation already in progress');
      return;
    }
    
    try {
      // Start progress indicator
      const progressInterval = simulateProgress();
      
      // Since the card doesn't exist, the generate API will create it
      const generateResult = await generateMembershipCard(userId);
      console.log('New card generation result:', generateResult);
      
      // Complete progress
      clearInterval(progressInterval);
      completeProgress();
      
      // Get the updated user data to ensure we have the latest info
      const updatedUserData = await getUserDetails(userId);
      setUser(updatedUserData);
      
      if (generateResult.membership_card_url || updatedUserData.membership_card_url) {
        let fullUrl = generateResult.membership_card_url || updatedUserData.membership_card_url;
        if (!fullUrl.startsWith('http')) {
          fullUrl = `${backendBaseUrl}${fullUrl}`;
        }
        
        // Add timestamp to prevent caching
        fullUrl = `${fullUrl}?t=${Date.now()}`;
        
        setCardUrl(fullUrl);
        setDirectViewUrl(`${backendBaseUrl}/auth/view-card/${userId}/?t=${Date.now()}`);
        setCardExists(true);
        
        setActionMessage('Membership card generated successfully!');
        setTimeout(() => setActionMessage(''), 5000);
      } else {
        throw new Error('Membership card URL not found after generation');
      }
    } catch (genError) {
      console.error('Error generating membership card:', genError);
      setError('Failed to generate membership card. Please try again.');
      
      // Ensure progress is reset on error
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setIsGenerating(false);
      setProgress(0);
    }
  };

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitialized.current) {
      return;
    }
    
    const initializeMembershipCard = async () => {
      if (!userId) {
        console.error('User ID not found in localStorage or URL');
        setError('User ID is required. Please log in again.');
        setLoading(false);
        return;
      }

      setLoading(true);
      isInitialized.current = true;
      
      try {
        // First, get user details
        console.log('Fetching user data for ID:', userId);
        const userData = await getUserDetails(userId);
        console.log('User data received:', userData);
        setUser(userData);

        // Check if card exists using the generate API
        const cardExists = await checkAndFetchCard();
        
        if (!cardExists) {
          // No card exists, show the interface to allow user to generate one
          console.log('No membership card found for user');
          setCardExists(false);
        }
        
      } catch (err) {
        console.error('Error initializing membership card:', err);
        setError('Failed to load membership card data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    initializeMembershipCard();
  }, [userId, backendBaseUrl]);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleDownload = () => {
    // Add timestamp to prevent caching
    const downloadUrl = `${backendBaseUrl}/auth/download-membership-card/${userId}/?t=${Date.now()}`;
    window.open(downloadUrl, '_blank');
  };

  const handleViewDirectly = () => {
    // Refresh directViewUrl with new timestamp before opening
    const refreshedUrl = `${backendBaseUrl}/auth/view-card/${userId}/?t=${Date.now()}`;
    window.open(refreshedUrl, '_blank');
  };

  const handleSendEmail = async () => {
    try {
      setSendingEmail(true);
      await sendMembershipCardEmail(userId);
      setActionMessage('Membership card sent to your email successfully!');
      setTimeout(() => setActionMessage(''), 5000);
    } catch (err) {
      console.error('Error sending email:', err);
      setError('Failed to send membership card to email. Please try again later.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setSendingEmail(false);
    }
  };

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      setError('');
      setActionMessage('');
      
      console.log('Regenerating membership card for user:', userId);
      
      // Start progress indicator
      const progressInterval = simulateProgress();
      
      // Call the regenerate API
      const result = await regenerateMembershipCard(userId);
      console.log('Regeneration result:', result);
      
      // Complete progress
      clearInterval(progressInterval);
      completeProgress();
      
      // Update user data in localStorage if provided
      if (result.user) {
        try {
          const userKey = localStorage.getItem('user') ? 'user' : 
                         localStorage.getItem('userData') ? 'userData' : 
                         localStorage.getItem('currentUser') ? 'currentUser' : null;
          
          if (userKey) {
            const currentUser = JSON.parse(localStorage.getItem(userKey) || '{}');
            const updatedUser = { ...currentUser, ...result.user };
            localStorage.setItem(userKey, JSON.stringify(updatedUser));
          }
          
          setUser(result.user);
        } catch (e) {
          console.error('Error updating user in localStorage:', e);
        }
      }
      
      // Update URLs with timestamps to prevent caching
      if (result.card_url || result.membership_card_url) {
        let fullUrl = result.card_url || result.membership_card_url;
        if (!fullUrl.startsWith('http')) {
          fullUrl = `${backendBaseUrl}${fullUrl}`;
        }
        
        // Add timestamp to prevent caching
        fullUrl = `${fullUrl}?t=${Date.now()}`;
        
        setCardUrl(fullUrl);
        setDirectViewUrl(`${backendBaseUrl}/auth/view-card/${userId}/?t=${Date.now()}`);
        setCardExists(true);
      } else {
        // If URL not directly returned, refetch user details
        const updatedUserData = await getUserDetails(userId);
        setUser(updatedUserData);
        
        if (updatedUserData.membership_card_url) {
          let fullUrl = updatedUserData.membership_card_url;
          if (!fullUrl.startsWith('http')) {
            fullUrl = `${backendBaseUrl}${fullUrl}`;
          }
          
          // Add timestamp to prevent caching
          fullUrl = `${fullUrl}?t=${Date.now()}`;
          
          setCardUrl(fullUrl);
          setDirectViewUrl(`${backendBaseUrl}/auth/view-card/${userId}/?t=${Date.now()}`);
          setCardExists(true);
        }
      }
      
      setActionMessage(result.message || 'Membership card regenerated successfully!');
      setTimeout(() => setActionMessage(''), 5000);
      
    } catch (err) {
      console.error('Error regenerating membership card:', err);
      const errorMessage = err.response?.data?.error || 'Failed to regenerate membership card. Please try again later.';
      setError(errorMessage);
      setTimeout(() => setError(''), 5000);
      
      // Ensure progress is reset on error
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setIsGenerating(false);
      setProgress(0);
    } finally {
      setRegenerating(false);
    }
  };

  const toggleInfoSection = () => {
    setInfoExpanded(!infoExpanded);
  };

  // Loading state
  if (loading) {
    return (
      <div className="membership-card-container">
        <div className="loading-spinner"></div>
        <p>Loading your membership card...</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="membership-card-container">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <p>User ID not found. Please log in to view your membership card.</p>
          <button onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="membership-card-container">
      <div className="membership-header">
        <div className="logo-section">
          <div className="kea-logo">KEA</div>
          <h1>Your Membership Card</h1>
        </div>
        <div className="membership-status">
          <span className="status-indicator active"></span>
          <span>Active Member</span>
        </div>
      </div>
      
      {/* Action Messages */}
      {actionMessage && (
        <div className="success-message">
          <i className="fas fa-check-circle"></i>
          <p>{actionMessage}</p>
        </div>
      )}
      
      {/* User Info Panel */}
  
      
      {/* Progress Bar (shown during card generation or regeneration) */}
      {(isGenerating || regenerating || progress > 0) && (
        <div className="regeneration-progress">
          <div className="progress-header">
            <i className="fas fa-sync-alt"></i>
            <span>{regenerating ? 'Regenerating your membership card...' : 'Generating your membership card...'}</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-percentage">
            {progress}%
          </div>
        </div>
      )}
      
      {/* Card Viewer */}
      {cardExists && directViewUrl ? (
        <div className="card-viewer-section">
          <div className="view-controls">
            <h2>Membership Card Preview</h2>
            <div className="view-mode-selector">
              <button 
                className={`view-mode-button ${viewMode === 'iframe' ? 'active' : ''}`}
                onClick={() => handleViewModeChange('iframe')}
              >
                View In Page
              </button>
              <button 
                className="view-mode-button external"
                onClick={handleViewDirectly}
              >
                <i className="fas fa-external-link-alt"></i> Open in New Tab
              </button>
            </div>
          </div>
          
          {viewMode === 'iframe' && (
            <div className="pdf-container">
              <PDFViewer pdfUrl={directViewUrl} />
            </div>
          )}
        </div>
      ) : (
        <div className="no-card-message">
          <i className="fas fa-id-card"></i>
          <p>No membership card available yet.</p>
          <button 
            className="action-button generate" 
            onClick={generateNewCard}
            disabled={isGenerating || !userId}
          >
            <i className={`fas ${isGenerating ? 'fa-spinner fa-spin' : 'fa-plus-circle'}`}></i> 
            {isGenerating ? 'Generating...' : 'Generate Membership Card'}
          </button>
        </div>
      )}
      
      {/* Card Actions - Only show if card exists */}
      {cardExists && (
        <div className="card-actions">
          {/* <button 
            className="action-button download" 
            onClick={handleDownload}
            disabled={!directViewUrl || isGenerating || regenerating}
          >
            <i className="fas fa-download"></i> Download Card
          </button> */}
          
          <button 
            className="action-button regenerate" 
            onClick={handleRegenerate}
            disabled={regenerating || !userId || isGenerating}
          >
            <i className={`fas ${regenerating || isGenerating ? 'fa-spinner fa-spin' : 'fa-sync-alt'}`}></i> 
            {regenerating || isGenerating ? 'Regenerating...' : 'Regenerate Card'}
          </button>
          
          <button 
            className="action-button email" 
            onClick={handleSendEmail} 
            disabled={sendingEmail || !userId || !directViewUrl || isGenerating || regenerating}
          >
            <i className="fas fa-envelope"></i> {sendingEmail ? 'Sending...' : 'Send to Email'}
          </button>
        </div>
      )}

      {/* About Section */}
      <div className="membership-info-section">
        <div className="info-header" onClick={toggleInfoSection}>
          <h2>About Your Membership Card</h2>
          <span className={`toggle-icon ${infoExpanded ? 'expanded' : ''}`}>
            {infoExpanded ? '−' : '+'}
          </span>
        </div>
        
        {infoExpanded && (
          <div className="info-content">
            <div className="info-card">
              <h3><i className="fas fa-id-card"></i> Card Usage</h3>
              <p>Your KEA Membership Card serves as your official identification at all Kerala Engineers' Association events and functions. It can be presented in digital form on your smartphone or printed as a physical card.</p>
            </div>
            
            <div className="info-card">
              <h3><i className="fas fa-qrcode"></i> QR Code</h3>
              <p>The QR code on your card contains your membership details for quick verification. Event organizers can scan this code to instantly verify your membership status.</p>
            </div>
            
            <div className="info-card">
              <h3><i className="fas fa-sync-alt"></i> Regenerate Card</h3>
              <p>If you've updated your profile picture or personal information, use the "Regenerate Card" button to create a new membership card with your latest details. This will update both your QR code and card information.</p>
            </div>
            
            <div className="info-card">
              <h3><i className="fas fa-tags"></i> Member Benefits</h3>
              <p>Presenting your membership card entitles you to special discounts and benefits at KEA partner organizations, professional development events, and networking opportunities.</p>
            </div>
            
            <div className="info-card">
              <h3><i className="fas fa-question-circle"></i> Need Help?</h3>
              <p>If you encounter any issues with your membership card, please contact the KEA secretariat at <a href="mailto:support@kea.org.in">support@kea.org.in</a> or call +91 80 2344 5678.</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <button onClick={() => setError('')}>Dismiss</button>
        </div>
      )}
    </div>
  );
};

export default MembershipCard;