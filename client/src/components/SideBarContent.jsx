import { useState } from 'react';
import {Box,Button, List, ListItem, styled } from '@mui/material';
import { SIDEBAR_DATA } from '../config/sidebar.config';
import { CreateOutlined } from '@mui/icons-material';
import { NavLink, useParams } from 'react-router-dom';
import { routes } from '../routes/routes';
import { useNavigate } from 'react-router-dom';
import ComposeMail from './ComposeMail';
import { Compose, Result, SetupRecognition } from '../WebSpeech';


var ct={"count":0,"counter":0,"mic":true}

var msg = new SpeechSynthesisUtterance();
msg.text="Hello, What would you like to do?"
window.speechSynthesis.speak(msg);

var recognition = SetupRecognition();
recognition.addEventListener("audioend", () => {
    console.log("Audio capturing ended");
    if(ct.mic){
        recognition.abort();
        setTimeout(function(){ recognition.start();},1000);
    }
});
setTimeout(function(){recognition.start()},3000);

var recognition1 = SetupRecognition();   
recognition1.addEventListener("audioend", () => {
    console.log("Audio capturing ended");
    if(!ct.mic){
        recognition1.abort();
        setTimeout(function(){ recognition1.start();},1000);
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
    const [openDrawer, setOpenDrawer] = useState(false);

    const { type } = useParams();

    const onComposeClick = () => {
        ct.mic=false;
        recognition.abort();        
        msg.text="Please spell out the email address of the recipient";
        window.speechSynthesis.speak(msg);  
        setTimeout(function(){recognition1.start();},3000);
        setOpenDrawer(true);
    }
    
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