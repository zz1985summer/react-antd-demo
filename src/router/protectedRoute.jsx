import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';


const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useSelector((state) => !!state.user.token);
    const location = useLocation();

    if(!isAuthenticated) {
        return <Navigate to="/login" replace state={{from:location}} />;
    }

    return children;
};

export default ProtectedRoute;