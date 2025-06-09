import React, { useState } from 'react';
export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {

    const [blogs, setBlogs] = useState();

    return (
        <AuthContext.Provider value={{}}>
            {children}
        </AuthContext.Provider>
    )
}