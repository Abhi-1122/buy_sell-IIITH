import React from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const Protected = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(null);  // 'null' to signify that we are still checking

    React.useEffect(() => {
        const verifyToken = async () => {
            try {
                const token = localStorage.getItem('token');
                // console.log('Token:', token);
                if (!token) {
                document.cookie = `token=${token}; path=/;`;
                }
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/verify-token`, { withCredentials: true });
                if (response.status === 200) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Token verification failed:', error);
                setIsAuthenticated(false);
            }
        };

        verifyToken();
    }, []);

    // Return a loading state while verifying the token
    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    // Redirect to login if not authenticated, otherwise render the protected children
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;  // Return the protected route components if authenticated
};

export default Protected;
