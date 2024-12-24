import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardPage.css'; // Importing the CSS file for styling

function DashboardPage() {
    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <Link to="/">Home</Link>
                <Link to="/logout">Logout</Link>
            </nav>
            <div className="dashboard-content">
                <h1>Welcome to Your Dashboard</h1>
                <section className="user-info">
                    <h2>User Information</h2>
                    <p>Name: John Doe</p>
                    <p>Email: john.doe@example.com</p>
                </section>
                <section className="recent-activity">
                    <h2>Recent Activity</h2>
                    <ul>
                        <li>Logged in from a new device.</li>
                        <li>Updated profile picture.</li>
                        <li>Shared a new post.</li>
                    </ul>
                </section>
                {/* Additional sections can be added here */}
            </div>
        </div>
    );
}

export default DashboardPage;