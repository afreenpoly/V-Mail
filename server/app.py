<<<<<<< HEAD
import os
import base64
import requests
from flask_cors import CORS
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from google.oauth2.credentials import Credentials
from gmail_services import send_message, list_messages, star_message
from googleapiclient.discovery import build
load_dotenv()

CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
SCOPES = ['https://mail.google.com/']
TOKEN_PICKLE_FILE = 'token.pickle'
API_URL = "https://api-inference.huggingface.co/models/aadilsayad/email-intent-classifier"
headers = {"Authorization": "Bearer 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"}
creds = None

app = Flask(__name__)
CORS(app)

@app.route('/tokens', methods=['POST'])
def get_tokens():
    global creds
    received_data = request.json
    try:
        creds = Credentials(
            client_id=CLIENT_ID,
            client_secret=CLIENT_SECRET,
            token=received_data['access_token'],
            refresh_token=received_data['refresh_token'],
            scopes=received_data['scope'],
        )
    except KeyError:
        print('Key Error')
        return jsonify({'info': 'Did not receive tokens. Key Error'})
    response = jsonify({'info': 'Received tokens successfully'})
    return response


def get_gmail_service():
    service = build("gmail", "v1", credentials=creds)
    return service

@app.route('/intent', methods=['POST'])
def get_intent():
    received_data = request.json
    huggingface_response = requests.post(API_URL, headers=headers, json=received_data)
    intent = huggingface_response.json()[0][0]['label']
    response = jsonify({'intent': intent})
    return response


@app.route('/send', methods=['POST'])
def send():
    received_data = request.json
    recipient = received_data['recipient']
    subject = received_data['subject']
    body = received_data['body']
    service = get_gmail_service()
    message = send_message(service, recipient, subject, body)
    response = jsonify({
        'message': message['id']
    })
    return response


@app.route('/inbox')
def inbox():
    service = get_gmail_service()
    messages = list_messages(service)
    response = jsonify({
        'messages': messages
    })
    return response


@app.route('/star', methods=['POST'])
def star():
    received_data = request.json
    service = get_gmail_service()
    message = star_message(service, received_data['message_id'])
    response = jsonify({
        'message': message['id']
    })
    return response


@app.route('/trash', methods=['POST'])
def trash():
    return


@app.route('/reply', methods=['POST'])
def reply():
    return


@app.route('/forward', methods=['POST'])
def forward():
    return


@app.route('/trash_list')
def trash_list():
    service = get_gmail_service()
    messages = list_messages(service, trash_only=True)
    response = jsonify({
        'messages': messages
    })
    return response


@app.route('/untrash', methods=['POST'])
def untrash():
    return


if __name__ == '__main__':
=======
import os
import base64
import requests
from flask_cors import CORS
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from google.oauth2.credentials import Credentials
from gmail_services import send_message, list_messages, star_message
from googleapiclient.discovery import build
load_dotenv()

CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
SCOPES = ['https://mail.google.com/']
TOKEN_PICKLE_FILE = 'token.pickle'
API_URL = "https://api-inference.huggingface.co/models/aadilsayad/email-intent-classifier"
headers = {"Authorization": "Bearer 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"}
creds = None

app = Flask(__name__)
CORS(app)

@app.route('/tokens', methods=['POST'])
def get_tokens():
    global creds
    received_data = request.json
    try:
        creds = Credentials(
            client_id=CLIENT_ID,
            client_secret=CLIENT_SECRET,
            token=received_data['access_token'],
            refresh_token=received_data['refresh_token'],
            scopes=received_data['scope'],
        )
    except KeyError:
        print('Key Error')
        return jsonify({'info': 'Did not receive tokens. Key Error'})
    response = jsonify({'info': 'Received tokens successfully'})
    return response


def get_gmail_service():
    service = build("gmail", "v1", credentials=creds)
    return service

@app.route('/intent', methods=['POST'])
def get_intent():
    received_data = request.json
    huggingface_response = requests.post(API_URL, headers=headers, json=received_data)
    intent = huggingface_response.json()[0][0]['label']
    response = jsonify({'intent': intent})
    return response


@app.route('/send', methods=['POST'])
def send():
    received_data = request.json
    recipient = received_data['recipient']
    subject = received_data['subject']
    body = received_data['body']
    service = get_gmail_service()
    message = send_message(service, recipient, subject, body)
    response = jsonify({
        'message': message['id']
    })
    return response


@app.route('/inbox')
def inbox():
    service = get_gmail_service()
    messages = list_messages(service)
    response = jsonify({
        'messages': messages
    })
    return response


@app.route('/star', methods=['POST'])
def star():
    received_data = request.json
    service = get_gmail_service()
    message = star_message(service, received_data['message_id'])
    response = jsonify({
        'message': message['id']
    })
    return response


@app.route('/trash', methods=['POST'])
def trash():
    return


@app.route('/reply', methods=['POST'])
def reply():
    return


@app.route('/forward', methods=['POST'])
def forward():
    return


@app.route('/trash_list')
def trash_list():
    service = get_gmail_service()
    messages = list_messages(service, trash_only=True)
    response = jsonify({
        'messages': messages
    })
    return response


@app.route('/untrash', methods=['POST'])
def untrash():
    return


if __name__ == '__main__':
>>>>>>> ee22708d1abcb1f775ec0e84408bb282fe504ecb
    app.run(host='localhost' , port=5000, debug=True)