import React from 'react';
import { Navigate } from 'react-router-dom';

const Verify = () => {
    const regex = /[?&]([^=#]+)=([^&#]*)/g;
    const params = {};
    let match;

    while ((match = regex.exec(window.location.href)) !== null) {
        params[match[1]] = decodeURIComponent(match[2].replace(/\+/g, ' '));
    }
    
    if(Object.keys(params).length > 0){
      localStorage.setItem('authInfo', JSON.stringify(params))
    }
    return(
        <Navigate to="/emails/inbox"/>
    );
}


export default Verify;