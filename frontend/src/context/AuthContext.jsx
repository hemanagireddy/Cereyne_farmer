import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('cerevyn_token');
            const savedUser = localStorage.getItem('cerevyn_user');

            if (token && savedUser) {
                setUser(JSON.parse(savedUser));
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/identity/login', { email, password });
        const { token, data } = response.data;

        localStorage.setItem('cerevyn_token', token);
        localStorage.setItem('cerevyn_user', JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
    };

    const register = async (userData) => {
        const response = await api.post('/identity/register', userData);
        const { token, data } = response.data;

        localStorage.setItem('cerevyn_token', token);
        localStorage.setItem('cerevyn_user', JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
    };

    const logout = () => {
        localStorage.removeItem('cerevyn_token');
        localStorage.removeItem('cerevyn_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
