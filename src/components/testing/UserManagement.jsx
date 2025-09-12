import React, { useState } from 'react';
import axios from 'axios';
import './UserManagement.css';

const UserManagement = () => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [action, setAction] = useState('check'); // 'check' or 'delete'

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email && !phoneNumber) {
      setResult({
        status: 'error',
        message: 'Please enter either email or phone number'
      });
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const endpoint = action === 'check' 
        ? 'http://127.0.0.1:8000/auth/check-user-exists/' 
        : 'http://127.0.0.1:8000/auth/delete-user/';
      
      const response = await axios.post(endpoint, {
        email: email || null,
        phone_number: phoneNumber || null
      });
      
      setResult({
        status: 'success',
        data: response.data
      });
    } catch (error) {
      console.error(`Error ${action === 'check' ? 'checking' : 'deleting'} user:`, error);
      
      setResult({
        status: 'error',
        message: error.response?.data?.error || 
                `Failed to ${action === 'check' ? 'check' : 'delete'} user. Please try again.`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-management-container">
      <div className="user-management-card">
        <h2>User Management Tool</h2>
        <p className="description">
          Use this tool to check if a user exists with a specific email or phone number, 
          or to delete users for testing purposes.
        </p>
        
        <div className="action-toggle">
          <button 
            className={`toggle-button ${action === 'check' ? 'active' : ''}`}
            onClick={() => setAction('check')}
          >
            Check User
          </button>
          <button 
            className={`toggle-button ${action === 'delete' ? 'active' : ''}`}
            onClick={() => setAction('delete')}
          >
            Delete User
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="1234567890"
            />
          </div>
          
          <button 
            type="submit" 
            className={`submit-button ${action === 'delete' ? 'delete-action' : ''}`}
            disabled={isLoading}
          >
            {isLoading 
              ? 'Processing...' 
              : action === 'check' 
                ? 'Check User' 
                : 'Delete User'}
          </button>
        </form>
        
        {result && (
          <div className={`result-box ${result.status}`}>
            {result.status === 'success' ? (
              <div className="success-result">
                <h3>Result:</h3>
                {action === 'check' ? (
                  <>
                    <p>User exists: <strong>{result.data.exists ? 'Yes' : 'No'}</strong></p>
                    {result.data.exists && (
                      <p>Fields: <strong>{result.data.fields.join(', ')}</strong></p>
                    )}
                    <p className="message">{result.data.message}</p>
                  </>
                ) : (
                  <>
                    <p>{result.data.message}</p>
                    {result.data.deleted_users && (
                      <div className="deleted-users">
                        <h4>Deleted Users:</h4>
                        <ul>
                          {result.data.deleted_users.map((user, index) => (
                            <li key={index}>
                              User ID: {user.user_id}<br />
                              Email: {user.email}<br />
                              Phone: {user.phone_number}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <p className="error-message">{result.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;