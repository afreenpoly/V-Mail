from flask import request, make_response, redirect, jsonify
import json ,base64
react="http://localhost:3000/emails"
class LoginManager:
    def __init__(self):
        self.Sessions = []
    
    def is_logged_in(self):
        
        #request is a library 
        #session -true :logged in 
        #check main.py
        #It flags the allow
        cookie=request.cookies.get("Session")
        if cookie in self.Sessions:
            return True
        else:
            return False
    
    def logout_user(self):
        
        #cookie is in client browser, session is in server
        #deletes cookie from client , session from session array
        cookie=request.cookies.get("Session")
        response = make_response(jsonify({"done": "done"}))
        if cookie in self.Sessions:
            
            #removing cookie from session 
            self.Sessions.remove(cookie)
            response.set_cookie("Session", " Delete",expires="Thu, 01 Jan 1970 00:00:00 GMT", samesite="None", secure=True)
        return response
    
    def login_user(self,user):
        response=make_response(redirect("http://localhost:3000/emails"))
        cookie={}
        cookie["access_token"]=user["access_token"]
        # cookie["refresh_token"]=user["refresh_token"]
        
        #scope is gmail , Not just read only, write only. 
        cookie["scope"] = user["scope"]
        cookie=json.dumps(cookie)
        cookie= base64.encodebytes(cookie.encode("utf-8"))
        response.set_cookie("Session",cookie.decode("utf-8"), samesite="None", secure=True)
        self.Sessions.append(cookie.decode("utf-8"))
        return response
    
    def get_user(self):
        cookie=request.cookies.get("Session")
        if cookie in self.Sessions:
            return base64.decodebytes(cookie.encode("utf-8")).decode("utf-8")
        else:
            return "Error"






