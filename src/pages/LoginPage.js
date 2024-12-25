import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../redux/AuthContext"; // Ensure this path matches your project structure
import './LoginPage.css';

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth(); // Destructure the login function from useAuth
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State to handle error messages

    const handleLogin = async (event) => {
        event.preventDefault();
        setError(''); // Clear any existing errors
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                login(data.access_token); // Use the login function from AuthContext
                navigate('/dashboard');
            } else {
                setError(data.error || 'Failed to login'); // Set error from response
            }
        } catch (error) {
            console.error('Network error:', error);
            setError('Network error, please try again later.');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h1>Login</h1>
                {error && <p className="error">{error}</p>} {/* Display error message */}
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