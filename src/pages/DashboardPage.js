import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardPage.css'; // Importing the CSS file for styling
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
    const [userInfo, setUserInfo] = useState({});
    const navigate = useNavigate();

      useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:5000/user-info', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUserInfo(data);
            } else {
                console.error('Failed to fetch user info');
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        fetchData();
    }, [navigate]);

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <Link to="/">Home</Link>
                <Link to="/logout">Logout</Link>
            </nav>
            <div className="dashboard-content">
                <section className="user-info">
                <h2>User Information</h2>
                    <p>Welcome, {userInfo.username}</p>
                    <p>Email: {userInfo.email}</p>
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