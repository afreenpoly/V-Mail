import { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { Box, List } from '@mui/material';
import EmailList from '../EmailList';
import { Bin, Inbox } from '../GAPI';

const Emails = () => {
    const { openDrawer } = useOutletContext();
    const { type } = useParams();
    const [ data,setData ] = useState([]);
    
    useEffect(() => {
        switch (type) {
            
          // from app.js it passes the type parameter
          // emails/{type}
          // if inbox calls inbox function
          // Function in GAPI
          case "inbox":
            Inbox().then((response) => {
              setData(response.messages.messages);
            });
            break;
          case "bin":
            Bin().then((response) => {
              setData(response.messages.messages);
            });
            break;
          default:
            console.log(type);
        }
    }, [type])



    return (
      <Box
        style={
          openDrawer ? { marginLeft: 250, width: "100%" } : { width: "100%" }
        }
      >
        {/* from user intend if inobx, the type is set as inbox and Inbox() is called in GAPI.js
                  where the data is stored in result and returned back here which sets the data and send as a 
                  parameter EmailList.jsx*/}
        <List>
          <EmailList data={data} />
        </List>
      </Box>
    );
}

export default Emails;
