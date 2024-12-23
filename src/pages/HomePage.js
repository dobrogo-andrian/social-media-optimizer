import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Importing the CSS file for styling

function HomePage() {
    return (
        <div className="home-container">
            <nav className="navbar">
                <div className="logo">Social Media Optimizer</div>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/features">Features</Link>
                    <Link to="/pricing">Pricing</Link>
                    <Link to="/support">Support</Link>
                </div>
                <div className="cta-buttons">
                    <Link to="/signup" className="btn btn-signup">Sign Up</Link>
                    <Link to="/login" className="btn btn-login">Login</Link>
                </div>
            </nav>
            <header className="hero-section">
                <h1>Welcome to Social Media Optimizer!</h1>
                <p>Optimize your social media strategy with data-driven insights.</p>
                <Link to="/signup" className="btn btn-large">Get Started</Link>
            </header>
            <section className="features">
                <h2>Features</h2>
                <div className="feature-grid">
                    <div className="feature-item">
                        <div className="icon">📊</div>
                        <h3>Analyze Performance</h3>
                        <p>Deep insights into your social media metrics.</p>
                    </div>
                    <div className="feature-item">
                        <div className="icon">💡</div>
                        <h3>Get Suggestions</h3>
                        <p>Optimization tips to improve your strategy.</p>
                    </div>
                    <div className="feature-item">
                        <div className="icon">📅</div>
                        <h3>Schedule Posts</h3>
                        <p>Effortless scheduling to save time.</p>
                    </div>
                    <div className="feature-item">
                        <div className="icon">📈</div>
                        <h3>Track Trends</h3>
                        <p>Stay ahead with the latest in social media.</p>
                    </div>
                </div>
            </section>
            <footer className="footer">
                <div className="footer-links">
                    <Link to="/about">About Us</Link>
                    <Link to="/faq">FAQs</Link>
                    <Link to="/blog">Blog</Link>
                    <Link to="/contact">Contact</Link>
                </div>
                <div className="social-media">
                    {/* Icons would be links to social media platforms */}
                    <a href="http://facebook.com">Facebook</a>
                    <a href="http://twitter.com">Twitter</a>
                    <a href="http://instagram.com">Instagram</a>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;