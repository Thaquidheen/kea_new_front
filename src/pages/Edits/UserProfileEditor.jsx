import React, { useState, useRef, useEffect } from 'react';
import { getUserProfile, updateUserProfile, deleteProfilePicture } from '../../api/AuthApi';
import './UserProfileEditor.css';
import { Api } from '../../api/apiurl';
import { useNotification } from '../../contexts/NotificationContext';

const UserProfileEditor = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    phone_number: '',
    college_name: '',
    company_name: '',
    designation: '',
    department_of_study: '',
    year_of_graduation: '',
    address: '',
    blood_group: '',
    profile_picture: null
  });

  const [originalProfile, setOriginalProfile] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);
  const { success, error: showError, info } = useNotification();

  const bloodGroupChoices = [
    ['A+', 'A Positive'],
    ['A-', 'A Negative'],
    ['B+', 'B Positive'],
    ['B-', 'B Negative'],
    ['AB+', 'AB Positive'],
    ['AB-', 'AB Negative'],
    ['O+', 'O Positive'],
    ['O-', 'O Negative']
  ];

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setFetchingProfile(true);
      info('Loading your profile information...');
      const response = await getUserProfile();
      
      if (response) {
        const profileData = {
          username: response.username || '',
          email: response.email || '',
          phone_number: response.phone_number || '',
          company_name: response.company_name || '',
          designation: response.designation || '',
          department_of_study: response.department_of_study || '',
          college_name: response.college_name || '',
          year_of_graduation: response.year_of_graduation || '',
          address: response.address || '',
          blood_group: response.blood_group || '',
          profile_picture: null
        };

        setProfile(profileData);
        setOriginalProfile(profileData);

        if (response.profile_picture_url) {
          setPreviewImage(response.profile_picture_url);
          info('Profile picture loaded successfully');
        } else {
          setPreviewImage(null);
        }
        success('Profile information loaded successfully');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setErrors({ 
        general: error.message || 'Failed to load profile data' 
      });
      showError(error.message || 'Failed to load profile data');
    } finally {
      setFetchingProfile(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          profile_picture: 'Please select a valid image file'
        }));
        showError('Please select a valid image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          profile_picture: 'Image size should be less than 5MB'
        }));
        showError('Image size should be less than 5MB');
        return;
      }

      setProfile(prev => ({
        ...prev,
        profile_picture: file
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        info('Image preview updated');
      };
      reader.readAsDataURL(file);

      setErrors(prev => ({
        ...prev,
        profile_picture: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!profile.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!profile.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^\+?[1-9]\d{9,14}$/.test(profile.phone_number)) {
      newErrors.phone_number = 'Enter a valid phone number';
    }

    if (profile.year_of_graduation && (profile.year_of_graduation < 1950 || profile.year_of_graduation > new Date().getFullYear() + 10)) {
      newErrors.year_of_graduation = 'Enter a valid graduation year';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      showError('Please fix the validation errors before submitting');
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      info('Preparing to update your profile...');
      const formData = new FormData();
      
      Object.keys(profile).forEach(key => {
        if (key === 'profile_picture' && profile[key] instanceof File) {
          formData.append(key, profile[key]);
        } else if (key !== 'profile_picture' && profile[key] !== originalProfile[key]) {
          if (profile[key] !== null && profile[key] !== '') {
            formData.append(key, profile[key]);
          }
        }
      });

      const hasChanges = Array.from(formData.keys()).length > 0;
      
      if (!hasChanges) {
        setSuccessMessage('No changes detected to update.');
        info('No changes detected to update');
        return;
      }

      info('Updating your profile...');
      const response = await updateUserProfile(formData);
      
      if (response) {
        setSuccessMessage(response.message || 'Profile updated successfully!');
        success(response.message || 'Profile updated successfully!');
        info('Refreshing profile data...');
        await fetchUserProfile();
        
        // Dispatch event to update navbar
        window.dispatchEvent(new Event('userUpdated'));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      
      if (error.fields) {
        setErrors(error.fields);
        showError('Please check the highlighted fields and try again');
      } else {
        setErrors({ 
          general: error.message || 'Failed to update profile. Please try again.' 
        });
        showError(error.message || 'Failed to update profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePicture = async () => {
    if (window.confirm('Are you sure you want to delete your profile picture?')) {
      try {
        setLoading(true);
        info('Deleting your profile picture...');
        const response = await deleteProfilePicture();
        
        if (response) {
          setPreviewImage(null);
          setProfile(prev => ({ ...prev, profile_picture: null }));
          setSuccessMessage(response.message || 'Profile picture deleted successfully!');
          success(response.message || 'Profile picture deleted successfully!');
          info('Refreshing profile data...');
          await fetchUserProfile();
          
          // Dispatch event to update navbar
          window.dispatchEvent(new Event('userUpdated'));
        }
      } catch (error) {
        console.error('Error deleting profile picture:', error);
        setErrors({ 
          profile_picture: error.message || 'Failed to delete profile picture' 
        });
        showError(error.message || 'Failed to delete profile picture');
      } finally {
        setLoading(false);
      }
    } else {
      info('Profile picture deletion cancelled');
    }
  };

  if (fetchingProfile) {
    return (
      <div className="profile-container">
        <div className="spinner-container">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-main-title">Edit Profile</h1>
        <p className="profile-subtitle">Update your personal information and profile picture</p>
      </div>

      {errors.general && (
        <div className="notification-alert notification-error">
          {errors.general}
        </div>
      )}

      {successMessage && (
        <div className="notification-alert notification-success">
          {successMessage}
        </div>
      )}

      <div className="profile-form-wrapper">
        {/* Profile Picture Section */}
        <div className="picture-upload-section">
          <h2 className="section-heading">Profile Picture</h2>
          <div className="picture-upload-container">
            <div className="picture-wrapper">
              <div className="picture-circle">
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Profile preview" 
                    className="picture-preview"
                    onError={() => setPreviewImage(null)} // fallback if load fails
                  />
                ) : (
                  <svg className="picture-placeholder" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="camera-overlay-btn"
                disabled={loading}
              >
                <svg className="camera-icon" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 002-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <div className="picture-actions">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="change-picture-btn"
                disabled={loading}
              >
                📸 Change Picture
              </button>
              {previewImage && (
                <button
                  type="button"
                  onClick={handleDeletePicture}
                  className="delete-picture-btn"
                  disabled={loading}
                >
                  🗑️ Delete Picture
                </button>
              )}
              <p className="file-upload-info">JPG, PNG up to 5MB</p>
              {errors.profile_picture && (
                <p className="field-error-message">{errors.profile_picture}</p>
              )}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden-file-input"
          />
        </div>

        {/* Basic Information */}
        <div className="form-fields-grid">
          <div className="input-group">
            <label className="input-label">
              👤 Username *
            </label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleInputChange}
              className={`form-field ${errors.username ? 'field-error' : ''}`}
              placeholder="Enter your username"
              disabled={loading}
            />
            {errors.username && <p className="field-error-message">{errors.username}</p>}
          </div>

          <div className="input-group">
            <label className="input-label">
              ✉️ Email (Read-only)
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              className="form-field"
              placeholder="Enter your email"
              disabled
            />
          </div>

          <div className="input-group">
            <label className="input-label">
              📞 Phone Number (Read only)
            </label>
            <input
              type="tel"
              name="phone_number"
              value={profile.phone_number}
              onChange={handleInputChange}
              className={`form-field ${errors.phone_number ? 'field-error' : ''}`}
              placeholder="Enter your phone number"
              disabled
            />
            {errors.phone_number && <p className="field-error-message">{errors.phone_number}</p>}
          </div>

          <div className="input-group">
            <label className="input-label">
              🩸 Blood Group
            </label>
            <select
              name="blood_group"
              value={profile.blood_group}
              onChange={handleInputChange}
              className="form-dropdown"
              disabled={loading}
            >
              <option value="">Select Blood Group</option>
              {bloodGroupChoices.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Professional Information */}
        <div className="info-section">
          <h2 className="section-heading">Professional Information</h2>
          <div className="section-fields-grid">
            <div className="input-group">
              <label className="input-label">
                🏢 Company Name
              </label>
              <input
                type="text"
                name="company_name"
                value={profile.company_name}
                onChange={handleInputChange}
                className="form-field"
                placeholder="Enter your company name"
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label className="input-label">
                💼 Designation
              </label>
              <input
                type="text"
                name="designation"
                value={profile.designation}
                onChange={handleInputChange}
                className="form-field"
                placeholder="Enter your designation"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Educational Information */}
        <div className="info-section">
          <h2 className="section-heading">Educational Information</h2>
          <div className="section-fields-grid">
            <div className="input-group">
              <label className="input-label">
                🎓 Department of Study
              </label>
              <input
                type="text"
                name="department_of_study"
                value={profile.department_of_study}
                onChange={handleInputChange}
                className="form-field"
                placeholder="Enter your department"
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label className="input-label">
                📅 Year of Graduation
              </label>
              <input
                type="number"
                name="year_of_graduation"
                value={profile.year_of_graduation}
                onChange={handleInputChange}
                className={`form-field ${errors.year_of_graduation ? 'field-error' : ''}`}
                placeholder="Enter graduation year"
                min="1950"
                max={new Date().getFullYear() + 10}
                disabled={loading}
              />
              {errors.year_of_graduation && <p className="field-error-message">{errors.year_of_graduation}</p>}
            </div>
            <div className="input-group">
              <label className="input-label">
                🎓 College Name
              </label>
              <input
                type="text"
                name="college_name"
                value={profile.college_name}
                onChange={handleInputChange}
                className="form-field"
                placeholder="Enter your department"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="input-group input-group-full">
          <label className="input-label">
            📍 Address
          </label>
          <textarea
            name="address"
            value={profile.address}
            onChange={handleInputChange}
            rows={4}
            className="form-textarea"
            placeholder="Enter your complete address"
            disabled={loading}
          />
        </div>

        {/* Submit Button */}
        <div className="submit-btn-container">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`submit-btn ${loading ? 'btn-loading' : ''}`}
          >
            <svg className="submit-icon" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>{loading ? 'Updating Profile...' : 'Update Profile'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileEditor;