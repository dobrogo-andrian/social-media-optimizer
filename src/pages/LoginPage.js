import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css'; // Make sure your CSS handles this addition gracefully

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (event) => {
        event.preventDefault();
        console.log("Login with:", username, password);
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