import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SuspenseLoader from './components/common/SuspenseLoader';
import { routes } from './routes/routes';
import { useEmail } from './Profile';

function Check() {
    const { setEmail }=useEmail();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function check() {
            try {
                var cred = localStorage.getItem('authInfo');
                cred = JSON.parse(cred);

                const response = await fetch(
                    'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + cred.access_token
                );
                const json = await response.json();
                console.log(json.email);
                if (json.email != undefined) {
                    setEmail(json.email);
                    setLoading(false);
                    navigate('/emails/inbox');
                }
                else
                    navigate('/home');
            } catch (error) {
                navigate("/home");
            }
        }
        check(); // Call the async function inside useEffect
    }, []); // Empty dependency array ensures the effect runs only once when the component mounts

    return (
        <>
            {loading ? (
                <SuspenseLoader />
            ) : (
                <routes.emails.element />
            )}
        </>
    );
}

export default Check;