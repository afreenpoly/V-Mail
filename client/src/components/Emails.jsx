import { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { API_URLS } from '../services/api.urls';
import { Box, List, Checkbox } from '@mui/material';
import Email from './Email';
import { DeleteOutline } from '@mui/icons-material';
import NoMails from './common/NoMails';
import { EMPTY_TABS } from '../constants/constant';
import EmailList from '../EmailList';
import { Bin, Inbox } from '../GAPI';

const Emails = () => {
    const [starredEmail, setStarredEmail] = useState(false);
    const [selectedEmails, setSelectedEmails] = useState([]);
    const { openDrawer } = useOutletContext();
    const { type } = useParams();
    const [ data,setData ] = useState([]);
    const getEmailsService = useApi(API_URLS.getEmailFromType);
    const deleteEmailsService = useApi(API_URLS.deleteEmails);
    const moveEmailsToBin = useApi(API_URLS.moveEmailsToBin);
    
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
        <Box style={openDrawer ? { marginLeft: 250, width: '100%' } : { width: '100%' } }>
            <List>
                <EmailList data={data}/>
            </List> 
            {
                <NoMails message={EMPTY_TABS[undefined]} />
            }
        </Box>
    )
}

export default Emails;
