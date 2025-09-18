import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/AuthApi';
import './Login.css';
import { useNotification } from '../../contexts/NotificationContext';

function Login() {
  const { success, error: showError, info } = useNotification();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!identifier || !password) {
      showError('Please fill in both fields.');
      return;
    }

    try {
      const data = await loginUser(identifier, password);
  
      // ✅ FIXED: Store auth data and notify navbar of changes
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('user', JSON.stringify(data.user));

      // ✅ FIXED: Dispatch custom event to notify navbar component
      window.dispatchEvent(new Event('authStateChanged'));

      success('Login successful!');
      navigate('/');
    } catch (errorData) {
      // If "response.ok" was false, we land here with the server's JSON in errorData
      console.error('Login error data:', errorData);

      if (errorData.error === 'You need a subscription' && errorData.user_id) {
        // 3) user membership not active → redirect to Payment page
        info('Your membership is not active. Redirecting to payment.');
        // Pass user_id so the Payment page can create an order with your backend
        navigate('/pay', { state: { userId: errorData.user_id, userName: errorData.username } });
      } else if (errorData.error === 'Invalid credentials') {
        showError('Invalid email or password!');
      } else {
        showError(errorData.error || 'Login failed for unknown reason.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        
        <label>Email or Phone:</label>
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Enter your email or phone"
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />

        <button type="submit">Login</button>

        <div className="login-links">
          <Link to="/forgot-password">Forgot Password?</Link>
          <Link to="/register">Sign Up</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;