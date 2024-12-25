import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css'; // Make sure your CSS handles this addition gracefully
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

const handleLogin = async (event) => {
    event.preventDefault();
    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        console.log('Response Status:', response.status); // Log response status
        const data = await response.json();
        console.log('Response Data:', data); // Log response data

        if (response.ok) {
            console.log('Login successful, navigating to dashboard');
            localStorage.setItem('token', data.access_token);
            navigate('/dashboard');
        } else {
            console.error('Login failed:', data.error);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
};

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h1>Login</h1>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="btn login-btn">Login</button>
                <div className="links">
                    <Link to="/">Home</Link>
                    <Link to="/reset-password">Forgot Password?</Link>
                    <Link to="/signup">Sign Up</Link>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;