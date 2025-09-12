import React from 'react';
import { FiBriefcase, FiUser, FiPhone, FiMapPin, FiDroplet, FiBookOpen, FiCalendar,  } from 'react-icons/fi';

export const StepTwo = ({ formData, handleChange }) => {
  const bloodGroups = [
    { value: '', label: 'Select Blood Group' },
    { value: 'A+', label: 'A+ (A Positive)' },
    { value: 'A-', label: 'A- (A Negative)' },
    { value: 'B+', label: 'B+ (B Positive)' },
    { value: 'B-', label: 'B- (B Negative)' },
    { value: 'AB+', label: 'AB+ (AB Positive)' },
    { value: 'AB-', label: 'AB- (AB Negative)' },
    { value: 'O+', label: 'O+ (O Positive)' },
    { value: 'O-', label: 'O- (O Negative)' },
  ];

  // Generate year options (current year to 50 years back)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = currentYear; year >= currentYear - 50; year--) {
    yearOptions.push(year);
  }

  return (
    <div className="form-step">
      <h3>Contact Details</h3>
      
      <div className="form-group">
        <label htmlFor="companyName">
          <FiBriefcase className="field-icon" />
          Company Name
        </label>
        <input
          id="companyName"
          name="companyName"
          type="text"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Enter Company Name"
          autoComplete="organization"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="designation">
          <FiUser className="field-icon" />
          Designation
        </label>
        <input
          id="designation"
          name="designation"
          type="text"
          value={formData.designation}
          onChange={handleChange}
          placeholder="Enter Your Job Title"
          autoComplete="organization-title"
        />
      </div>

      {/* Academic Information Section */}
      <div className="form-section">
        <h4 className="section-title">Academic Information</h4>
        
        <div className="form-group">
          <label htmlFor="college_name">
            {/* <FiGraduationCa className="field-icon" /> */}
            College/University Name
          </label>
          <input
            id="college_name"
            name="college_name"
            type="text"
            value={formData.college_name || ''}
            onChange={handleChange}
            placeholder="Enter your college or university name"
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="department_of_study">
            <FiBookOpen className="field-icon" />
            Department of Study
          </label>
          <input
            id="department_of_study"
            name="department_of_study"
            type="text"
            value={formData.department_of_study || ''}
            onChange={handleChange}
            placeholder="e.g., Computer Science, Mechanical Engineering, Business Administration"
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="year_of_graduation">
            <FiCalendar className="field-icon" />
            Year of Graduation
          </label>
          <select
            id="year_of_graduation"
            name="year_of_graduation"
            value={formData.year_of_graduation || ''}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select Graduation Year</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="contactNo">
          <FiPhone className="field-icon" />
          Contact Number
        </label>
        <input
          id="contactNo"
          name="contactNo"
          type="tel"
          value={formData.contactNo}
          onChange={handleChange}
          placeholder="Enter Your Phone Number"
          autoComplete="tel"
        />
        <small className="input-hint">We'll send a verification code to this number</small>
      </div>
      
      <div className="form-group">
        <label htmlFor="address">
          <FiMapPin className="field-icon" />
          Address
        </label>
        <input
          id="address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter Street, City, Country"
          autoComplete="street-address"
        />
      </div>
      
      {/* Blood Group Field */}
      <div className="form-group">
        <label htmlFor="bloodGroup">
          <FiDroplet className="field-icon" />
          Blood Group
          <span className="optional-field"> (Optional)</span>
        </label>
        <select
          id="bloodGroup"
          name="bloodGroup"
          value={formData.bloodGroup || ''}
          onChange={handleChange}
          className="form-select"
        >
          {bloodGroups.map((group) => (
            <option key={group.value} value={group.value}>
              {group.label}
            </option>
          ))}
        </select>
        <small className="input-hint">This information may be helpful for emergency situations</small>
      </div>
    </div>
  );
};