import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios'; // Make sure to install axios with npm or yarn
import './SignUpPage.css';

function SignUpPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const history = useHistory();

    const handleSignUp = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const res = await axios.post('/api/check-user', { username, email });
            if (res.data.exists) {
                alert("User already exists with this username or email.");
                return;
            }

            const signupResponse = await axios.post('/api/create-user', {
                username,
                password, // In a real app, hash this before sending
                email
            });

            if (signupResponse.data.success) {
                alert("User created successfully!");
                history.push('/login');
            } else {
                alert("Failed to create user.");
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert("An error occurred during signup.");
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSignUp}>
                <h1>Sign Up</h1>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit" className="btn signup-btn">Sign Up</button>
                <div className="links">
                    <Link to="/">Home</Link>
                    <Link to="/login">Already have an account? Log In</Link>
                </div>
            </form>
        </div>
    );
}

export default SignUpPage;