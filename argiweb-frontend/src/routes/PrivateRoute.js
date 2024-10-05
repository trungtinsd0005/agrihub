import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, isAdminRequired }) => {
    const token = localStorage.getItem('access_token'); 
    
    if (!token) {
        return (
            <Navigate to="/notfound" replace />
        );
    }
    
    const decodedToken = JSON.parse(atob(token.split('.')[1]));

    if (isAdminRequired && !decodedToken.payload.isAdmin) {
        return (
            <Navigate to="/notfound" replace />
        )
    }

    return element;
};

export default PrivateRoute;