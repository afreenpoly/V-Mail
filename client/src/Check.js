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
                var cred = JSON.parse(localStorage.getItem('authInfo'));
                var access_code = cred['code']
                const response = await fetch(
                    'https://oauth2.googleapis.com/token', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({
                            code: access_code,
                            client_id: CLIENT_ID,
                            client_secret: CLIENT_SECRET,
                            redirect_uri: REDIRECT_URI,
                            grant_type: 'authorization_code',
                        }),
                    }
                );
        
                const responseData = await response.json();
                console.log(responseData);
                localStorage.setItem("accessRefresh", JSON.stringify(responseData))


                const resp = await fetch(
                    'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + responseData.access_token
                );

                const respJSON = await resp.json();
                console.log(respJSON)

                respJSON.email='aadilsayad@gmail.com'
                
                if (respJSON.email != undefined) {
                    setEmail(respJSON.email);
                    setLoading(false);
                    navigate('/emails/inbox');
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