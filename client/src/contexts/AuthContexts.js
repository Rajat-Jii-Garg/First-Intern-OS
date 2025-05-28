// client/src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/auth.service';
import authHeaderUtil from '../utils/authHeader'; // Renamed to avoid conflict
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // user object from backend { _id, name, email, role, avatar, token }
    const [loadingAuth, setLoadingAuth] = useState(true);

    const loadUser = useCallback(async () => {
        const storedUser = authService.getCurrentUser(); // Gets { token, user: { _id, name, ...} }
        if (storedUser && storedUser.token) {
            try {
                const decodedToken = jwtDecode(storedUser.token);
                if (decodedToken.exp * 1000 < Date.now()) {
                    authService.logout(); // Token expired
                    setUser(null);
                } else {
                    // Optionally re-fetch user data from /me to ensure it's fresh
                    // For now, trust the stored user data if token is valid
                    // To ensure role and other details are up-to-date, a /me call is good on initial load
                    try {
                        const freshUserDataResponse = await authService.getMe(authHeaderUtil());
                        // Merge token with fresh user data
                        setUser({ ...freshUserDataResponse.data.data, token: storedUser.token });
                    } catch (error) {
                         console.error("Failed to fetch fresh user data, using stored.", error);
                         authService.logout(); // If /me fails, logout
                         setUser(null);
                    }
                }
            } catch (error) {
                console.error("Invalid token:", error);
                authService.logout();
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoadingAuth(false);
    }, []);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const login = useCallback(async (email, password) => {
        try {
            const responseData = await authService.login(email, password); // responseData contains { token, user: {...} }
            setUser(responseData); // Set the entire object from backend
            return responseData;
        } catch (error) {
            setUser(null);
            throw error;
        }
    }, []);

    const signup = useCallback(async (name, email, password) => {
        try {
            const responseData = await authService.signup(name, email, password);
            setUser(responseData);
            return responseData;
        } catch (error) {
            setUser(null);
            throw error;
        }
    }, []);

    const logout = useCallback(() => {
        authService.logout();
        setUser(null);
    }, []);

    const updateUserContext = useCallback((updatedUserInfo) => {
        // Called after profile/avatar update
        setUser(prevUser => {
            const newUser = {
                ...prevUser, // Keep existing token
                user: { ...prevUser.user, ...updatedUserInfo } // Update user details within the user object
            };
             // Update localStorage as well
            const storedUser = authService.getCurrentUser();
            if (storedUser) {
                localStorage.setItem('user', JSON.stringify({token: storedUser.token, user: newUser.user}));
            }
            return newUser;
        });
    }, []);


    const value = {
        user: user ? user.user : null, // Expose user details directly
        token: user ? user.token : null,
        isAuthenticated: !!user,
        isAdmin: user && user.user && user.user.role === 'admin',
        loadingAuth,
        login,
        signup,
        logout,
        reloadUser: loadUser, // Function to explicitly reload user (e.g., after critical updates)
        updateUserContext
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};