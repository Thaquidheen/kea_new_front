import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PasswordResetConfirm() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [tokenValid, setTokenValid] = useState(null);
    const [message, setMessage] = useState('');
    
    useEffect(() => {
        // Validate token on mount
        axios.post('/api/auth/password-reset/validate/', { token })
            .then(() => setTokenValid(true))
            .catch(() => setTokenValid(false));
    }, [token]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('/api/auth/password-reset/confirm/', {
                token,
                password,
                confirm_password: confirmPassword
            });
            setMessage('Password reset successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setMessage(error.response?.data?.password?.[0] || 'An error occurred');
        }
    };
    
    if (tokenValid === false) {
        return <div>Invalid or expired token</div>;
    }
    
    if (tokenValid === null) {
        return <div>Validating token...</div>;
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                required
            />
            <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
            />
            <button type="submit">Reset Password</button>
            {message && <p>{message}</p>}
        </form>
    );
}