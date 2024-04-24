import { useState,useEffect } from "react";

import {
  Dialog,
  styled,
  Typography,
  Box,
  InputBase,
  TextField,
  Button,
} from "@mui/material";
import { Close, DeleteOutline } from "@mui/icons-material";

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

var dict={"to": '',"subject":'',"body":''}

const ComposeMail = ({ open, setOpenDrawer,ct,recognition1,recognition,Compose,msg}) => {
  const [data, setData] = useState({});

  var msgs=["Please spell out the email address of the recipient","Subject","Please verbalize the content of your email ","Proceed forward yes or no","Add, Replace or Cancel"];

  useEffect(()=>{
    const interval=setInterval(()=>{
      setData({"to":dict.to.toLowerCase(),"subject":dict.subject,"body":dict.body});
    },500);
    return () => clearInterval(interval);
  }, []);

  
  const onValueChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    dict[e.target.name]=e.target.value
  };

  const sendEmail = async () => {
      try {
        const sendDetails = {
          recipient: dict.to,
          subject: dict.subject,
          body: dict.body
        }
    const response = await fetch('https://127.0.0.1:8080/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendDetails),
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error('Failed to send email');
    }
        else{
          ct.mic=true
          recognition1.abort();
          ct.count=0;
          ct.counter=0;
          ct.final_transcript='';
          dict={"to": '',"subject":'',"body":'' };
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
      ct.mic=true
      recognition1.abort();
      dict={"to": '',"subject":'',"body":'' };
      ct.count=0;
      ct.counter=0;
      ct.final_transcript='';
      setTimeout(function(){recognition.start();},1000);
      setOpenDrawer(false);
      setData({});
  };

  Compose(recognition1,ct,msg,msgs,dict,sendEmail,closeComposeMail)

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

export default ComposeMail