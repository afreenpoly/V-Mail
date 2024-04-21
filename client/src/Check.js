import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SuspenseLoader from './components/common/SuspenseLoader';
import { routes } from './routes/routes';
import { useEmail } from './Profile';

function Check() {
    const CLIENT_ID = '435103188171-s26urp6qsll47klpef1tqi5dkhu2tp1p.apps.googleusercontent.com'
    const CLIENT_SECRET = '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'
    const REDIRECT_URI = 'http://localhost:3000/verify'
    const { setEmail }=useEmail();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function check() {
            try {

                const resp = await fetch(
                    'https://127.0.0.1:8080/checkuser',
                    { credentials:"include"}
                );

                const respJSON = await resp.json();
                console.log(respJSON)
                
                if (respJSON.allow === 1) {
                    setEmail(respJSON.email);
                    setLoading(false);
                }
                else{
                    navigate('/home');
                }
            } catch (error) {
                console.log('Error identified: ' + error)
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