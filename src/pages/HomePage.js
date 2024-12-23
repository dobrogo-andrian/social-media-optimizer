
import React from 'react';
import { Link } from 'react-router-dom';


function HomePage() {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Welcome to Social Media Optimizer!</h1>
                <p>Optimize your social media strategy with data-driven insights.</p>
            </header>
            <section className="features">
                <h2>Features</h2>
                <ul>
                    <li>Analyze social media performance</li>
                    <li>Get optimization suggestions</li>
                    <li>Schedule posts effortlessly</li>
                    <li>Track engagement and trends</li>
                </ul>
            </section>
            <div className="cta-buttons">
                <Link to="/signup" className="signup-btn">Sign Up</Link>
                <Link to="/login" className="login-btn">Login</Link>
            </div>
        </div>
    );
}

export default HomePage;