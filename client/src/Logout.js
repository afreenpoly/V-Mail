import React from 'react';
import { Navigate } from 'react-router-dom';

function Logout() {
        // Remove authInfo from local storage
        localStorage.removeItem('authInfo');
        // Navigate to '/home'
    return(
        <Navigate to="/home"/>
    );
}

export default Logout;