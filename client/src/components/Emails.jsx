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
import { Inbox } from '../GAPI';

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
        switch(type){
            case "inbox":
                Inbox().then((response)=>{
                  setData(response.messages.messages);  
                });
                break;
            default:
                console.log("Wha?")
        }
    }, [type,data])

    const selectAllEmails = (e) => {
        if (e.target.checked) {
            const emails = getEmailsService?.response?.map(email => email._id);
            setSelectedEmails(emails);
        } else {
            setSelectedEmails([]);
        }
    }

    const deleteSelectedEmails = () => {
        if (type === 'bin') {
            deleteEmailsService.call(selectedEmails);
        } else {
            moveEmailsToBin.call(selectedEmails);
        }
        setStarredEmail(prevState => !prevState);
    }

    return (
        <Box style={openDrawer ? { marginLeft: 250, width: '100%' } : { width: '100%' } }>
            <Box style={{ padding: '20px 10px 0 10px', display: 'flex', alignItems: 'center' }}>
                <Checkbox size="small" onChange={(e) => selectAllEmails(e)} />
                <DeleteOutline onClick={(e) => deleteSelectedEmails(e)} />
            </Box>
            <List>
                <EmailList data={data}/>
            </List> 
            {
                getEmailsService?.response?.length === 0 &&
                    <NoMails message={EMPTY_TABS[type]} />
            }
        </Box>
    )
}

export default Emails;
