import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Effect to check token presence and fetch user info on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserInfo(token).catch(console.error);
    }
  }, []);

  // Function to fetch user information
  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/user-info', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        throw new Error('Failed to fetch user info');
      }
    } catch (error) {
      console.error(error);
      logout();  // Logout the user if there is an issue fetching user information
    }
  };

  // Login function to set the token and fetch user info
  const login = async (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
    await fetchUserInfo(token);
  };

  // Logout function to clear token and reset user state
  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);