import React,{ useEffect } from 'react';
import { Navigate } from 'react-router-dom';

function Logout() {
    useEffect(() => {
        async function check() {
            try {

                const resp = await fetch(
                    'https://127.0.0.1:8080/logout',
                    { credentials:"include"}
                );
                const respJSON = await resp.json();
                console.log(respJSON)
            } catch (error) {
                console.log('Error identified: ' + error)
            }
        }
        check(); // Call the async function inside useEffect
    }, []); // E
    return(
        <Navigate to="/home"/>
    );
}

export default Logout;