import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SuspenseLoader from './components/common/SuspenseLoader';
import { routes } from './routes/routes';
import { useEmail } from './Profile';

function Check() {
  const CLIENT_ID =
    "435103188171-s26urp6qsll47klpef1tqi5dkhu2tp1p.apps.googleusercontent.com";
  const CLIENT_SECRET = "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";
  const { setEmail } = useEmail();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  var x = 0;
  useEffect(() => {
    async function check() {
      try {
        // route protecting, when someone tries to bypass the login through URL
        // checks whether the user is logged in
        const resp = await fetch("https://127.0.0.1:8080/checkuser", {
          credentials: "include",
        });

        const respJSON = await resp.json();
        console.log(respJSON);

        // allow ==1 means logged in
        if (respJSON.allow === 1) {
          setEmail(respJSON.email);
          setLoading(false);
        } else {
          navigate("/home");
        }
      } catch (error) {
        console.log("Error identified: " + error);
        navigate("/home");
      }
    }
    check(); // Call the async function inside useEffect
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  // If logged in returns /emails
  return (
    <>{loading && x == 0 ? <SuspenseLoader /> : <routes.emails.element />}</>
  );
}

export default Check;