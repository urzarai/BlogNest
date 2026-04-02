import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [blogs, setBlogs] = useState([]);
    const [profile, setProfile] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get("/api/users/my-profile", {
                    withCredentials: true,
                });
                setProfile(data);
                setIsAuthenticated(true);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchBlogs = async () => {
            try {
                const { data } = await axios.get("/api/blogs/all-blogs", {
                    withCredentials: true,
                });
                setBlogs(data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchBlogs();
        fetchProfile();
    }, []);

    return (
        <AuthContext.Provider value={{ blogs, profile, isAuthenticated, setIsAuthenticated, setProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);