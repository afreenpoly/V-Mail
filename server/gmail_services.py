import base64
import email
from email.message import EmailMessage
from email.mime.multipart import MIMEMultipart
from googleapiclient.errors import HttpError

def send_message(service, recipient, subject, body):
    message = EmailMessage()
    message.set_content(body)
    message["To"] = recipient
    message["Subject"] = subject
    encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
    create_message = {"raw": encoded_message}
    try:
        send_message = service.users().messages().send(userId="me", body=create_message).execute()
        print(f'Message Id: {send_message["id"]}')
    except HttpError as error:
        print(f"An error occurred: {error}")
        send_message = None
    return send_message


def list_messages(service, trash_only=False):
    messages = []
    i=0
    try:
        if trash_only:
            gmail_response = service.users().messages().list(userId="me", labelIds=['TRASH']).execute()        
        else:
            gmail_response = service.users().messages().list(userId="me", labelIds=['INBOX']).execute()
        response_messages = gmail_response.get('messages', [])
        for response_message in response_messages:
            temp_message = (service.users().messages().get(userId='me', id=response_message["id"]).execute())
            fromEmail = None
            date = None
            subject = None
            message_text = '' 
            snippet = temp_message['snippet']
            for header in temp_message['payload']['headers']:
                name = header['name'].lower()
                if name == 'from':
                    fromEmail = header['value']
                elif name == 'subject':
                    subject = header['value']
                elif name == 'date':
                    date = header['value']
            if temp_message['payload']['mimeType'] == 'text/plain' and 'body' in temp_message['payload']:
                body = temp_message['payload']['body']
                if 'data' in body:
                    message_text = base64.urlsafe_b64decode(body['data']).decode('utf-8')
                else:
                    message_text = body.get('text', '')

            message = {
                'id': response_message['id'],
                'from': fromEmail,
                'date': date,
                'subject': subject,
                'snippet': snippet,
                'body': message_text
            }
            messages.append(message)
            if i==10:
                break
            i+=1
    except HttpError as error:
        print(f"An error occurred: {error}")
        messages = None
    response = {'messages': messages}
    return response


def star_message(service, id):
    request_body = {
        "addLabelIds": ["STARRED"]
    }
    try:
        starred_message = service.users().messages().modify(userId="me", id=id, body=request_body).execute()
    except HttpError as error:
        print(f"An error occurred: {error}")
        starred_message = None
    return starred_message


def trash_message(service, id):
    try:
        trashed_message = service.users().messages().trash(userId="me", id=id).execute()
    except HttpError as error:
        print(f"An error occurred: {error}")
        trashed_message = None
    return trashed_message


def reply_to_message(service, id, reply_body):
    original_message = service.users().messages().get(userId='me', id=id, format="raw").execute()
    raw_message = original_message['raw']
    decoded_bytes = base64.urlsafe_b64decode(raw_message.encode('ASCII'))
    original_email = email.message_from_bytes(decoded_bytes)

    reply_message = EmailMessage()
    reply_message['Subject'] = 'Re: ' + original_email['Subject']
    reply_message['To'] = original_email['From']  # Reply to the original sender
    reply_message['In-Reply-To'] = original_email['Message-ID']  # Link to the original thread
    reply_message['References'] = original_email['Message-ID']  # Maintain thread context 
    reply_message.set_content(reply_body)

    # Optional: Quote the original message
    if '>' not in reply_body:  # Simple check to avoid excessive quoting
       reply_body = '\n\n> ' + original_email.get_payload(decode=True).decode() + '\n' + reply_body

    reply_message.set_content(reply_body)

    encoded_message = base64.urlsafe_b64encode(reply_message.as_bytes())
    create_message = {'raw': encoded_message.decode()}
    
    try:
        replied_message = service.users().messages().send(userId="me", body=create_message).execute()
    except HttpError as error:
        print(f"An error occurred: {error}")
        replied_message = None
    return replied_message


def forward_message(service, id, recipient_list):
    original_message = service.users().messages().get(userId='me', id=id, format="raw").execute()
    raw_message = original_message['raw']
    decoded_bytes = base64.urlsafe_b64decode(raw_message.encode('ASCII'))
    original_email = email.message_from_bytes(decoded_bytes)

    new_message = EmailMessage()
    new_message['Subject'] = 'Fwd: ' + original_email['Subject']
    new_message['To'] = recipient_list
    new_message['From'] = 'me'  # Replace with your email address if different

    # Optional: Add a forwarding note
    forwarding_note = "-------- Forwarded Message --------\n"
    new_message.set_content(forwarding_note)

    # Attach the original message (optional)
    new_message.add_attachment(original_email.as_bytes(), maintype='message', subtype='rfc822')

    encoded_message = base64.urlsafe_b64encode(new_message.as_bytes())
    create_message = {'raw': encoded_message.decode()}
    try:
        forwarded_message = service.users().messages().send(userId="me", body=create_message).execute()
        print(f'Message Id: {forwarded_message["id"]}')
    except HttpError as error:
        print(f"An error occurred: {error}")
        forwarded_message = None
    return forwarded_message


def untrash_message(service, id):
    try:
        service.users().messages().untrash(userId="me", id=id).execute()
    except HttpError as error:
        print(f"An error occurred: {error}")
        untrashed_message = None
    return untrashed_message