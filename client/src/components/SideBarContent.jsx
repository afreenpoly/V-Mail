import { useState, useEffect } from 'react';
import {Box,Button, List, ListItem, styled } from '@mui/material';
import { SIDEBAR_DATA } from '../config/sidebar.config';
import { CreateOutlined } from '@mui/icons-material';
import { NavLink, useParams, useNavigate, useLocation } from 'react-router-dom';
import { routes } from '../routes/routes';
import ComposeMail from './ComposeMail';
import { Compose, ListEmail, Result, SetupRecognition } from '../WebSpeech';

var ct={"count":0,"counter":0,"mic":true,"countdown":3000,"recog":false}

var msg = new SpeechSynthesisUtterance();

var recognition = SetupRecognition(ct);
recognition.addEventListener("audioend", () => {
    console.log("Audio capturing ended");
    if(ct.mic){
        recognition.abort();
        setTimeout(function(){ recognition.start();},1000);
    }
});



var recognition1 = SetupRecognition(ct);   
recognition1.addEventListener("audioend", () => {
    console.log("Audio capturing ended");
    if(!ct.mic){
        recognition1.abort();
        setTimeout(function(){ recognition1.start();},ct.countdown);
    }
});
var final_transcript='';
      
const Container = styled(Box)`
    padding: 8px;
    & > ul {
        padding: 10px 0 0 5px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        & > a {
            text-decoration: none;
            color: inherit;
        }
        & > a > li > svg {
            margin-right: 20px;
        }
    }
`

const ComposeButton = styled(Button)`
    background: #c2e7ff;
    color: #001d35;
    border-radius: 16px;
    padding: 15px;
    min-width: 140px;
    text-transform: none;
`
 
const SideBarContent = () => {
   
    const navigate=useNavigate();
    const location=useLocation();
    const [openDrawer, setOpenDrawer] = useState(false);

    const { type } = useParams();

    const onComposeClick = () => {
        ct.mic=false;
        ct.countdown=3000;
        recognition.abort();        
        msg.text="Please spell out the email address of the recipient";
        window.speechSynthesis.speak(msg);  
        setTimeout(function(){recognition1.start();},3000);
        setOpenDrawer(true);
    }

    useEffect(() => {
            console.log(location.pathname)
            switch(location.pathname){
                case "/emails":
                    if(ct.mic===false){
                        ct.mic=true
                        recognition1.abort();
                        ct.count=0;
                        ct.counter=0;
                        final_transcript='';
                    }
                    if(ct.recog===false){
                        ct.recog=true
                        msg.text="Hello, What would you like to do?"
                        window.speechSynthesis.speak(msg);
                        setTimeout(function(){recognition.start()},3000);
                    }
                    break
                case "/emails/inbox":
                    ct.mic=false;
                    recognition.stop();
                    break
                case "/emails/bin":
                    ct.mic=false;
                    recognition.stop();
                    break

            }
    }, [location])
    
  Result(recognition,navigate,onComposeClick,msg);
      
    return (
        <Container>
            <ComposeButton onClick={() => onComposeClick()}>
                <CreateOutlined style={{ marginRight: 10 }} />Compose
            </ComposeButton>
            <List>
                {
                    SIDEBAR_DATA.map(data => (
                        <NavLink key={data.name} to={`${routes.emails.path}/${data.name}`}>
                            <ListItem style={ type === data.name.toLowerCase() ? {
                                backgroundColor: '#d3e3fd',
                                borderRadius: '0 16px 16px 0'
                            } : {}}><data.icon fontSize="small" />{data.title}</ListItem>
                        </NavLink>
                    ))
                }
            </List>
            <ComposeMail open={openDrawer} setOpenDrawer={setOpenDrawer}  ct={ct} recognition={recognition} recognition1={recognition1} Compose={Compose}
             final_transcript={final_transcript} msg={msg}/>
        </Container>
    )
}

export default SideBarContent;