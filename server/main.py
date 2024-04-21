# Python standard libraries
import json
import os

# Third-party libraries
from flask import Flask, redirect, request, jsonify
from login import LoginManager
from oauthlib.oauth2 import WebApplicationClient
import requests
from google.oauth2.credentials import Credentials
from gmail_services import *
from googleapiclient.discovery import build



# Configuration
GOOGLE_CLIENT_ID = "435103188171-s26urp6qsll47klpef1tqi5dkhu2tp1p.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "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"
GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"


# Flask app setup
app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY") or os.urandom(24)



# User session management setup
# https://flask-login.readthedocs.io/en/latest
login_manager = LoginManager()



react="http://localhost:3000"

# OAuth 2 client setup
client = WebApplicationClient(GOOGLE_CLIENT_ID)

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

# Homepage
@app.route("/")
def index():
    if login_manager.is_logged_in():
        return "Yes"
    else:
        return "No"

# Homepage
@app.route("/checkuser")
def user():
    if login_manager.is_logged_in():
        response = jsonify({'allow': 1})
    else:
        response = jsonify({'allow': 0})
    return response


# Login
def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()


@app.route("/login")
def login():
    # Find out what URL to hit for Google login
    endpoint = "https://accounts.google.com/o/oauth2/v2/auth"
    params = {
        "client_id": "435103188171-s26urp6qsll47klpef1tqi5dkhu2tp1p.apps.googleusercontent.com",
        "redirect_uri": request.base_url+"/callback",
        "response_type": "code",
        "scope": "https://mail.google.com",
        "access_type": "offline"
    }
    # Construct the redirect URL
    redirect_url = endpoint + "?" + "&".join([f"{key}={value}" for key, value in params.items()])
    # Redirect the user to the constructed URL
    return redirect(redirect_url)


# Login Callback
@app.route("/login/callback",methods=['POST','GET'])
def callback():
    # Get authorization code Google sent back to you
    code = request.args.get("code")
    result = "<p>code: " + code + "</p>"
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]
    # Prepare and send a request to get tokens! Yay tokens!
    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=request.base_url,
        code=code,
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
    )
    # Parse the tokens!
    client.parse_request_body_response(json.dumps(token_response.json()))
    # Now that you have tokens let's find and hit the URL
    # from Google that gives you the user's profile information,
    # including their Google profile image and email
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    print(token_response.json())
    user = token_response.json()
    resp=login_manager.login_user(user)
    return resp


# Logout
@app.route("/logout")
def logout():
    response=login_manager.logout_user()
    return response

# Detail
@app.route("/userdetails")
def userdetail():
    return login_manager.get_user()

API_URL = "https://api-inference.huggingface.co/models/aadilsayad/email-intent-classifier"
headers = {"Authorization": "Bearer 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"}

def get_gmail_service():
    creds = Credentials(
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        token=json.loads(login_manager.get_user())['access_token'],
        # refresh_token=json.loads(login_manager.get_user())['refresh_token'],
        scopes=json.loads(login_manager.get_user())['scope'],
    )
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
    message_id = received_data['message_id']
    service = get_gmail_service()
    message = star_message(service, message_id)
    response = jsonify({
        'message': message['id']
    })
    return response


@app.route('/trash', methods=['POST'])
def trash():
    received_data = request.json
    message_id = received_data['message_id']
    service = get_gmail_service()
    message = trash_message(service, message_id)
    response = jsonify({
        'message': message['id']
    })
    return response


@app.route('/reply', methods=['POST'])
def reply():
    received_data = request.json
    message_id = received_data['message_id']
    reply_body = received_data['reply_body']
    service = get_gmail_service()
    message = reply_to_message(service, message_id, reply_body)
    response = jsonify({
        'message': message['id']
    })
    return response


@app.route('/forward', methods=['POST'])
def forward():
    received_data = request.json
    message_id = received_data['message_id']
    recipient_list = received_data['recipient_list']
    service = get_gmail_service()
    message = forward_message(service, message_id, recipient_list)
    response = jsonify({
        'message': message['id']
    })
    return response


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
    received_data = request.json
    message_id = received_data['message_id']
    service = get_gmail_service()
    message = untrash_message(service, message_id)
    response = jsonify({
        'message': message['id']
    })
    return response



if __name__ == "__main__":
    app.run(ssl_context="adhoc", port=8080, debug=True)