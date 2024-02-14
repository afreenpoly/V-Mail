import React, { useEffect, useState } from 'react';
import { ListItem, Checkbox, Typography, Box, styled } from "@mui/material";
import { StarBorder, Star } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { routes } from "./routes/routes";

const Wrapper = styled(ListItem)`
    padding: 0 0 0 10px;
    background: #f2f6fc;
    cursor: pointer;
    & > div {
        display: flex;
        width: 100%
    }
    & > div > p {
        font-size: 14px;
    }
`;

const Indicator = styled(Typography)`
    font-size: 12px !important;
    background: #ddd;
    color: #222;
    border-radius: 4px;
    margin-right: 6px;
    padding: 0 4px;
`;

const Date = styled(Typography)({
    marginLeft: 'auto',
    marginRight: 20,
    fontSize: 12,
    color: '#5F6368'
})

var cred=localStorage.getItem('authInfo')
cred=JSON.parse(cred);
const EmailDetails = async (messageId) => {
    try {
        // Make a fetch request to the Gmail API to get the email message details
        const response = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}`, {
            headers: {
                Authorization: `Bearer ${cred.access_token}` // Include your OAuth2 access token here
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch email message');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching email message:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
};


const EmailList = () => {
    const [message, setMessage] = useState([]);
    const navigate=useNavigate();
    useEffect(() => {
        const fetchEmails = async () => {
            try {
                // Fetch email data from Gmail API
                const response = await fetch(
                    'https://www.googleapis.com/gmail/v1/users/me/messages?q=in:inbox',
                    {
                        headers: {
                            Authorization: `Bearer ${cred.access_token}` // Replace accessToken with your actual access token
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch emails');
                }
                const dict=[];
                const data = await response.json();                
                for(var i=0;i<data.messages.length;i++){
                    const emaildata=await EmailDetails(data.messages[i].id);
                    dict.push(emaildata)
                    setMessage(dict);
                }
            } catch (error) {
                console.error('Error fetching emails:', error);
            }
        };

        fetchEmails();
    }, []); // Empty dependency array ensures the effect runs only once

    return (
        message.map((emailDetail) => (
        <Wrapper>
        <Checkbox 
            size="small" 
        />
        <Box onClick={() => navigate(routes.view.path, { state: { email: emailDetail }})}>
            <Typography style={{ width: 200 }}>From:{emailDetail.payload.headers.find(header => header.name === 'From').value.split('@')[0]}</Typography>
            <Indicator>Inbox</Indicator>
            <Typography>{emailDetail.payload.headers.find(header => header.name === 'Subject').value} {emailDetail.snippet && '-'} {emailDetail.snippet}</Typography>
            <Date>
            </Date>
        </Box>
    </Wrapper>
        ))
    );
};

export default EmailList;