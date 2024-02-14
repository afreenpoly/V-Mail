import React from 'react';
import { Navigate } from 'react-router-dom';

function Verify() {
    let params = {}
    let regex = /([^&=]+)=([^&]*)/g, m
    
    while (m = regex.exec(window.location.href)) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2])
    }
    
    if(Object.keys(params).length > 0){
        localStorage.setItem('authInfo', JSON.stringify(params))
    }

    return(
        <Navigate to="/emails/inbox"/>
    );
}

export default Verify;