// FeaturesSection.js
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from './AuthContext';

function FeaturesSection() {
    const { isLoggedIn } = useAuth();
    const history = useHistory();

    const handleFeatureClick = (path) => {
        if (isLoggedIn) {
            history.push(path);
        } else {
            alert('Please log in to access the dashboard.');
            history.push('/login');
        }
    };

    return (
        <section className="features">
            <h2>Features</h2>
            <div className="feature-grid">
                <div onClick={() => handleFeatureClick('/dashboard')} className="feature-item">
                    {/* Feature items here */}
                </div>
                {/* Other features */}
            </div>
        </section>
    );
}

export default FeaturesSection;