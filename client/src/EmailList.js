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



const EmailList = (data) => {
    const navigate=useNavigate();
    return (
        data.data.map((emailDetail) => (
        <Wrapper>
        <Checkbox 
            size="small" 
        />
        <Box onClick={() => navigate(routes.view.path, { state: { email: emailDetail }})}>
            <Typography style={{ width: 200 }}>{emailDetail.from.split('@')[0]}</Typography>
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