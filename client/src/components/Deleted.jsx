import { Box, Typography, styled } from '@mui/material';
import { useOutletContext, useLocation } from 'react-router-dom';
import { ArrowBack, Delete} from '@mui/icons-material';
import { useEffect} from 'react';
import { ReadDeleted, SetupRecognition } from '../WebSpeech';

const IconWrapper = styled(Box)({
    padding: 15
});

const Subject = styled(Typography)({
    fontSize: 22,
    margin: '10px 0 20px 75px',
    display: 'flex'
})

const Indicator = styled(Box)`
    font-size: 12px !important;
    background: #ddd;
    color: #222;
    border-radius: 4px;
    margin-left: 6px;
    padding: 2px 4px;
    align-self: center;
`;


const Container = styled(Box)({
    marginLeft: 15,
    width: '100%',
    '& > div': {
        display: 'flex',
        '& > p > span': {
            fontSize: 12,
            color: '#5E5E5E'
        }
    }
});

const Date = styled(Typography)({
    margin: '0 50px 0 auto',
    fontSize: 12,
    color: '#5E5E5E'
})


var f={"recog":true,"mic":false,"count":0}
var recogn = SetupRecognition(f);
recogn.addEventListener("audioend", () => {
    console.log("Audio capturing ended");
    if(f.mic){
        recogn.abort();
        setTimeout(function(){ recogn.start();},1000);
    }
});

var Rrecogn = SetupRecognition(f);
Rrecogn.addEventListener("audioend", () => {
    console.log("Audio capturing ended");
    if(!f.mic){
        Rrecogn.abort();
        setTimeout(function(){ Rrecogn.start();},3000);
    }
});

var Frecogn = SetupRecognition(f);
Frecogn.addEventListener("audioend", () => {
    console.log("Audio capturing ended");
    if(!f.mic){
        Frecogn.abort();
        setTimeout(function(){ Frecogn.start();},3000);
    }
});

const Deleted = () => {
    const { openDrawer } = useOutletContext();

    // The state of email is recived and stored in email
    const { state } = useLocation();
    const { email } = state;


    const untrash = async () => {
        try {
          const sendDetails = {
            message_id: email.id,
          }
      const response = await fetch('https://127.0.0.1:8080/untrash', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(sendDetails),
          credentials: "include"
      });
  
      if (!response.ok) {
          throw new Error('Failed to untrash email');
      }
          else{
            
            console.log('Email untrashed successfully');
          }
      } catch (error) {
          console.error('Error:', error);
      }
    };

    useEffect(() => {

        // check webspeech.jsx
            ReadDeleted(recogn,f,email,untrash)
    },[email])


    return (
        <Box style={openDrawer ? { marginLeft: 250, width: '100%' } : { width: '100%' } }>
            <IconWrapper>
                <ArrowBack fontSize='small' color="action" onClick={() =>{ window.location="/emails/bin"; f.mic="false" ; recogn.stop(); }} />
                <Delete fontSize='small' color="action" style={{ marginLeft: 40 }} onClick={() => untrash() } />
            </IconWrapper>
            <Subject>{email.subject} <Indicator component="span">Inbox</Indicator></Subject>
            <Box style={{ display: 'flex' }}>
                <Container>
                    <Box>
                        <Typography>    
                            {email.from.split('@')[0]} 
                            <Box component="span">&nbsp;&#60;{email.from}&#62;</Box>
                        </Typography>
                        <Date>
                            {(new window.Date(email.date)).getDate()}&nbsp;
                            {(new window.Date(email.date)).toLocaleString('default', { month: 'long' })}&nbsp;
                            {(new window.Date(email.date)).getFullYear()} 
                        </Date>
                    </Box>
                    <Typography style={{ marginTop: 20 }}>{email.body}</Typography>
                </Container>
            </Box>
        </Box>       
    )
}

export default Deleted;