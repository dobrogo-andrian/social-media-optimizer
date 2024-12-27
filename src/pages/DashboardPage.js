import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../redux/AuthContext";
import './DashboardPage.css';
import { Link } from 'react-router-dom';

function DashboardPage() {
     const [userInfo, setUserInfo] = useState({});
    const [instagramData, setInstagramData] = useState({posts: [], insights: {}});
    const [textAdvice, setTextAdvice] = useState('');
    const navigate = useNavigate();
    const {isLoggedIn, logout} = useAuth();
const fetchTextAdvice = async (caption) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:5000/improve-text', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ text: caption })
        });

        if (response.ok) {
            const data = await response.json();
            setTextAdvice(data.suggestions);
            console.log(data.suggestions); // Should now log the optimized text
        } else {
            console.error('Failed to fetch text advice');
        }
    } catch (error) {
        console.error('Network error:', error);
    }
};

    const handleAnalyzeText = () => {
        const caption = instagramData.posts[currentPostIndex].caption;
        fetchTextAdvice(caption);
        console.log('Analyzing text:', caption)
    };
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }


        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token');
            try {
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
                    logout();
                }
            } catch (error) {
                console.error('Network error:', error);
                logout();
            }
        };
        const fetchInstagramData = async () => {
            const accessToken = "IGAAM5WTByfPNBZAE54RUVUMkt4T1JFTDNtN2l2QnRjN0ZAVanQtWWltYmNfSGpsZAFFnNUhhRzc2OGxIREd4aVUyQWMyeW80WmNLMFFNMDJHT2c4bjRUZA21tRlRJWWxLOHh3NlZAYa3lPYnVpU0VlVzctc1lFVms0dDdueEVGMFF0VQZDZD"
            if (!accessToken) {
                console.error('No access token available.');
                return;
            }

            const url = `https://graph.instagram.com/me/media?fields=id,caption,media_url,media_type,permalink,timestamp&access_token=${accessToken}`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    const text = await response.text(); // This will capture non-JSON responses as well
                    console.error('Instagram API error:', text);
                    return;
                }
                const data = await response.json();

                const posts = data.data.map(post => ({
                    id: post.id,
                    image: post.media_url,
                    caption: post.caption,
                    type: post.media_type,
                    link: post.permalink,
                    timestamp: post.timestamp
                }));

                const insightsData = {
                    followers: 'Data not available', // Placeholder as this requires additional API call
                    likesPerPost: 'Data not available' // Placeholder as this requires additional API call
                };

                setInstagramData({posts, insights: insightsData});
            } catch (error) {
                console.error('Failed to fetch from Instagram API:', error);
                logout();
                navigate('/login');
            }
        };

        fetchUserInfo();
        fetchInstagramData();
    }, [isLoggedIn, navigate, logout]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    const [currentPostIndex, setCurrentPostIndex] = useState(0);
    const goToNextPost = () => {
        setCurrentPostIndex(prevIndex => (prevIndex + 1) % instagramData.posts.length);
    };

    const goToPreviousPost = () => {
        setCurrentPostIndex(prevIndex => (prevIndex - 1 + instagramData.posts.length) % instagramData.posts.length);
    };

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <Link to="/">Home</Link>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </nav>
            <div className="dashboard-content">
                <section className="user-info">
                    <h2>User Information</h2>
                    <p>Welcome, {userInfo.username}</p>
                </section>
                <section className="instagram-data">
                    <h2>Instagram Data</h2>
                    <div className="horizontal-section">
                        <div className="recent-posts">
                            <h3>Recent Posts</h3>
                            {instagramData.posts.length > 0 && (
                                <div className="post-item">
                                    <img src={instagramData.posts[currentPostIndex].image} alt="Post thumbnail"/>
                                    <p>{instagramData.posts[currentPostIndex].caption}</p>
                                </div>
                            )}

                            <div className="button-container">
                                <button onClick={goToPreviousPost}>Previous</button>
                                <button onClick={goToNextPost}>Next</button>
                            </div>
                        </div>
                        <div className="insights">
                            <div className="post-item">
                            <p><strong>Improved text:</strong> {textAdvice}</p>
                            <button onClick={handleAnalyzeText} className="analyze-text-button">Analyze Text
                            </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default DashboardPage;