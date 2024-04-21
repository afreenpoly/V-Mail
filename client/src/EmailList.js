import React, { useEffect, useState } from 'react';
import { ListItem, Checkbox, Typography, Box, styled } from "@mui/material";
import { StarBorder, Star } from '@mui/icons-material';
import { useNavigate, useLocation } from "react-router-dom";
import { routes } from "./routes/routes";
import { ListEmail } from './WebSpeech';
import { SetupRecognition } from './WebSpeech';

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

var flag={"recog":true,"mic":false,"count":0}
var recog = SetupRecognition(flag);
recog.addEventListener("audioend", () => {
    console.log("Audio capturing ended");
    if(flag.mic){
        recog.abort();
        setTimeout(function(){ recog.start();},1000);
    }
});


const EmailList = (data) => {
    const navigate=useNavigate();
    const location=useLocation();
    useEffect(() => {
        ListEmail(recog,flag,data.data,navigate)
    },[data.data,flag.count])

    return (
        data.data.map((emailDetail) => (
        <Wrapper>
        <Checkbox 
            size="small" 
        />
        <Box onClick={() =>{ navigate(routes.view.path, { state: { email: emailDetail }}); flag.count=0 ; flag.mic=false ; recog.stop(); }}>
            <Typography style={{ width: 200 }}>{emailDetail.from.split(' ')[0]}</Typography>
            <Indicator>Inbox</Indicator>
            <Typography>{emailDetail.subject} {emailDetail.snippet && '-'}</Typography>
            <Date>
            </Date>
        </Box>
    </Wrapper>
        ))
    );
};

export default EmailList;