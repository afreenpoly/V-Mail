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

var dict={"recipient_list":''}


// same as ComposeMail.jsx but for the functioning of forward
// only consist of "To" , subject and body are the same
const Forward = ({ open, setOpenDrawer,ct,recognition1,recognition,ComposeForward,final_transcript,msg,message_id}) => {
  const [data, setData] = useState({});

  var msgs=["Proceed forward yes or no","Retry or Cancel"];

  useEffect(()=>{
    const interval=setInterval(()=>{
      setData({"recipient_list":dict.recipient_list});
    },500);
    return () => clearInterval(interval);
  }, []);

  
  const onValueChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    dict[e.target.name]=e.target.value
  };

  const sendEmailF = async () => {
      try {
        const sendDetails = {
          message_id: message_id,
          recipient_list: dict.recipient_list
        }
    const response = await fetch('https://127.0.0.1:8080/forward', {
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
          final_transcript='';
          dict={"recipient_list":''};
          setTimeout(function(){recognition.start();},1000);
          setOpenDrawer(false);
          setData({});
          console.log('Email sent successfully');
        }
    } catch (error) {
        console.error('Error sending email:', error);
    }
  };

  const closeComposeMailF = () => {
      ct.mic=true
      recognition1.abort();
      dict={"recipient_list":''};
      final_transcript='';
      ct.count=0;
      ct.counter=0;
      setTimeout(function(){recognition.start();},1000);
      setOpenDrawer(false);
      setData({});
  };

  ComposeForward(recognition1,ct,final_transcript,msg,msgs,dict,sendEmailF,closeComposeMailF)

  return (
    <Dialog open={open} PaperProps={{ sx: dialogStyle }}>
      <Header>
        <Typography>Forward</Typography>
        <Close fontSize="small" onClick={(e) => closeComposeMailF(e)} />
      </Header>
      <RecipientWrapper>
        <InputBase
          placeholder="Recipients"
          name="recipient_list"
          onChange={(e) => onValueChange(e)}
          value={data.recipient_list}
        />
      </RecipientWrapper>
      <Footer>
        <SendButton onClick={(e) => sendEmailF(e)}>Send</SendButton>
        <DeleteOutline onClick={() => setOpenDrawer(false)} />
      </Footer>
    </Dialog>
  );
};

export default Forward