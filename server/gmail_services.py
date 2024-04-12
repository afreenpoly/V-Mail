import base64

from email.message import EmailMessage
from googleapiclient.errors import HttpError

def send_message(service, recipient, subject, body):
    message = EmailMessage()
    message.set_content(body)
    message["To"] = recipient
    message["Subject"] = subject
    encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
    create_message = {"raw": encoded_message}
    try:
        send_message = (service.users().messages().send(userId="me", body=create_message).execute())
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
        message_ids = gmail_response.get('messages', [])
        for id in message_ids:
            temp_message = (service.users().messages().get(userId='me', id=id["id"]).execute())
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


def trash_message(service):
    return


def reply_to_message(service):
    return


def forward_message(service):
    return


def untrash_message(service):
    return