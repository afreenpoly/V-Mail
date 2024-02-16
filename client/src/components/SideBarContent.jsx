import { useEffect, useState } from 'react';
import { Dialog,Typography,Box,InputBase,TextField,Button, List, ListItem, styled } from '@mui/material';
import { SIDEBAR_DATA } from '../config/sidebar.config';
import { CreateOutlined } from '@mui/icons-material';
import { NavLink, useParams } from 'react-router-dom';
import { routes } from '../routes/routes';
import { useNavigate } from 'react-router-dom';
import { Close, DeleteOutline } from "@mui/icons-material";
import useApi from "../hooks/useApi";
import { API_URLS } from "../services/api.urls";
import { useEmail } from '../Profile';
 
async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/aadilsayad/email-intent-classifier",
        {
            headers: { Authorization: "Bearer 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" }, //api token here
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.json();
    return result;
}
var cred=localStorage.getItem('accessRefresh')
cred=JSON.parse(cred)
var mic=true;
var SpeechRecognition=window.webkitSpeechRecognition
var msg = new SpeechSynthesisUtterance();
var recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.onstart=()=>{
    console.log("Start")
};
recognition.onend=()=>{
    console.log("Stop");
};
recognition.onerror = (event) => {
    console.error('Recognition error:', event.error);
};

recognition.addEventListener("speechend", () => {
    console.log("Speech has stopped being detected");
});
msg.text="Hello, What would you like to do?"
window.speechSynthesis.speak(msg);
recognition.addEventListener("audioend", () => {
    console.log("Audio capturing ended");
    if(mic){
        recognition.abort();
        setTimeout(function(){ recognition.start();},1000);
    }
});
recognition.start();
  var dict={"to": '',"subject":'',"body":'' }
      var count=0;
      var counter=0;
      var msgs=["Please spell out the email address of the recipient","Subject","Please verbalize the content of your email ","Proceed forward yes or no","Add, Replace or Cancel"];
      var recognition1 = new SpeechRecognition();
      recognition1.continuous = true;
      recognition1.interimResults = true;
      recognition1.onstart=()=>{
          console.log("Start")
      };
      recognition1.onend=()=>{
          console.log("Stop");
      };
      recognition1.onerror = (event) => {
          console.error('Recognition error:', event.error);
      };
    
      recognition1.addEventListener("speechend", () => {
          console.log("Speech has stopped being detected");
      });
      
      recognition1.addEventListener("audioend", () => {
          console.log("Audio capturing ended");
          if(!mic){
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

  const dialogStyle = {
    height: "93%",
    width: "80%",
    maxWidth: "100%",
    maxHeight: "100%",
    boxShadow: "none",
    borderRadius: "10px",
  };
  
  const Header = styled(Box)`
    display: flex;
    justify-content: space-between;
    padding: 10px 15px;
    background: #f2f6fc;
    & > p {
      font-size: 14px;
      font-weight: 500;
    }
  `;
  
  const RecipientWrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    padding: 0 15px;
    & > div {
      font-size: 14px;
      border-bottom: 1px solid #f5f5f5;
      margin-top: 10px;
    }
  `;
  
  const Footer = styled(Box)`
    display: flex;
    justify-content: space-between;
    padding: 10px 15px;
    align-items: center;
  `;
  
  const SendButton = styled(Button)`
    background: #0b57d0;
    color: #fff;
    font-weight: 500;
    text-transform: none;
    border-radius: 18px;
    width: 100px;
  `;
  
  const ComposeMail = ({ open, setOpenDrawer }) => {
    const { email } = useEmail();
    const [data, setData] = useState({});
    const sentEmailService = useApi(API_URLS.saveSentEmails);

    useEffect(()=>{
      const interval=setInterval(()=>{
        setData({"to":dict.to.toLowerCase().replace(" ", ""),"subject":dict.subject,"body":dict.body});
      },500);
      return () => clearInterval(interval);
    }, []);
  
    
    const onValueChange = (e) => {
      setData({ ...data, [e.target.name]: e.target.value });
    
      if (e.target.name === "to") {
        const wordWithoutSpaces = e.target.value.replace(/\s/g, ""); // Remove spaces
        dict[e.target.name] = wordWithoutSpaces;
      } else {
        dict[e.target.name] = e.target.value;
      }
    };
    
 
    const sendEmail = async () => {
        try {
          const payload = [
            'From: '+email,
            'To: '+dict.to,
            'Subject: '+dict.subject,
            'Content-Type: text/plain; charset=utf-8',
            '',
            dict.body
        ].join('\r\n');
        const encodedMessage =btoa(payload);
          const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages/send', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${cred.access_token}`,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  raw: encodedMessage
              })
          });

          if (!response.ok) {
              throw new Error('Failed to send email');
          }
          else{
            mic=true
            recognition1.abort();
            count=0;
            counter=0;
            setTimeout(function(){recognition.start();},1000);
            setOpenDrawer(false);
            setData({});
            console.log('Email sent successfully');
          }
      } catch (error) {
          console.error('Error sending email:', error);
      }
    };
  
    const closeComposeMail = () => {
        mic=true
        recognition1.abort();
        dict={"to": '',"subject":'',"body":'' };
        count=0;
        counter=0;
        final_transcript='';
        setTimeout(function(){recognition.start();},1000);
        setOpenDrawer(false);
        setData({});
    };
  
    recognition1.onresult = function(event) {
      var interim_transcript = '';
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          console.log(event.results[i][0].transcript);
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      switch(count){
        case 0:
          dict.to=final_transcript+interim_transcript;
          dict.to=dict.to.replace(/\s/g, "");
          if (event.results[i].isFinal) {
            msg.text=msgs[3];
            window.speechSynthesis.speak(msg);
            recognition1.stop();
            count+=1;
          }
          break;         
        case 3:
          dict.subject=final_transcript+interim_transcript;
          if (event.results[i].isFinal) {
            msg.text=msgs[3];
            window.speechSynthesis.speak(msg);
            recognition1.stop(); 
            count+=1;
          }
          break;          
        case 6:
          dict.body=final_transcript+interim_transcript;
          if (event.results[i].isFinal) {
            msg.text=msgs[3];
            window.speechSynthesis.speak(msg);
            recognition1.stop(); 
            count+=1;
          }
          break;          
        case 1:   
        case 4:
        case 7:
          if (event.results[i].isFinal)
            switch(event.results[i][0].transcript.toLowerCase().replace(/\s+/g, '').replace('.','')){
              case "yes":
                if(count!==7){
                  count+=2;
                  counter+=1;
                  msg.text=msgs[counter];
                  window.speechSynthesis.speak(msg);
                  recognition1.abort();                  
                  final_transcript='';
                  interim_transcript='';
                }
                else{
                  sendEmail();
                }
                break;
              case "no":
                count+=1;
                msg.text=msgs[4];
                window.speechSynthesis.speak(msg);
                recognition1.abort();
                break  
              default:
                msg.text="Please repeat your statement Yes or No"
                window.speechSynthesis.speak(msg);
                recognition1.abort(); 
                break;           
          }
          break
        case 2:
        case 5:
        case 8:
          if (event.results[i].isFinal)
          switch(event.results[i][0].transcript.toLowerCase().replace(/\s+/g, '').replace('.','')){
            case "add":
              count-=2;
              msg.text=msgs[counter];
              window.speechSynthesis.speak(msg);
              recognition1.abort(); 
              break;
            case "replace":
              count-=2;
              interim_transcript='';
              final_transcript='';
              msg.text=msgs[counter];
              window.speechSynthesis.speak(msg);
              recognition1.abort(); 
              break;             
            case "cancel":
              closeComposeMail();
              final_transcript='';
              break
            default:
              msg.text="Please repeat your statement Add , Repeat or Cancel"
              window.speechSynthesis.speak(msg);
              recognition1.abort(); 
              break;
        }
        break;
        default:
          msg.text="Please repeat your statement"
          window.speechSynthesis.speak(msg);
          recognition1.abort(); 
          break;
      }
    }   
  };

    return (
      <Dialog open={open} PaperProps={{ sx: dialogStyle }}>
        <Header>
          <Typography>New Message</Typography>
          <Close fontSize="small" onClick={(e) => closeComposeMail(e)} />
        </Header>
        <RecipientWrapper>
          <InputBase
            placeholder="Recipients"
            name="to"
            onChange={(e) => onValueChange(e)}
            value={data.to}
          />
          <InputBase
            placeholder="Subject"
            name="subject"
            onChange={(e) => onValueChange(e)}
            value={data.subject}
          />
        </RecipientWrapper>
        <TextField
          multiline
          rows={20}
          sx={{ "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}
          name="body"
          onChange={(e) => onValueChange(e)}
          value={data.body}
        />
        <Footer>
          <SendButton onClick={(e) => sendEmail(e)}>Send</SendButton>
          <DeleteOutline onClick={() => setOpenDrawer(false)} />
        </Footer>
      </Dialog>
    );
  };


const SideBarContent = () => {
   
    const navigate=useNavigate();
    const [openDrawer, setOpenDrawer] = useState(false);

    const { type } = useParams();

    const onComposeClick = () => {
        mic=false;
        recognition.abort();        
        msg.text=msgs[0];
        window.speechSynthesis.speak(msg);  
        setTimeout(function(){recognition1.start();},1000);
        setOpenDrawer(true);
    }
    
    recognition.onresult = function(event) {
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            console.log(event.results[i][0].transcript);
            query({"inputs":event.results[i][0].transcript}).then((response) => {
                if(response!==undefined && response[0]!==undefined && response[0][0].label!==undefined){
                    console.log(JSON.stringify(response[0][0].label));
                    switch(response[0][0].label){
                        case "list":
                            navigate('/emails/inbox');
                            break;
                        case "trash":
                            navigate('/emails/bin');
                            break;
                        case "star":
                            navigate('/emails/starred');
                            break;                            
                        case "send":
                            onComposeClick();                    
                            break
                        default:
                            msg.text=response[0][0].label;
                            window.speechSynthesis.speak(msg);
                    }
                }
            });
          }
        }
      };
      
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
            <ComposeMail open={openDrawer} setOpenDrawer={setOpenDrawer} />
        </Container>
    )
}

export default SideBarContent;