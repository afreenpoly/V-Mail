async function query(data) {
    try{
    const response = await fetch(
        "https://127.0.0.1:8080/intent",
        {
            headers: {'Content-Type': 'application/json'},
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.json();
    return result;
  }
  catch{
    return {"intent":"unknown"}
  }
}

function beeper(frequency=100){
  var constraints = { audio: true }
  navigator.mediaDevices.getUserMedia(constraints)
  .then((stream) => {
      var audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime); // Frequency of 200 Hz
      oscillator.detune.setValueAtTime(frequency, audioContext.currentTime); // Detune by 200 cents
      
      // Connect the oscillator to the audio output
      oscillator.connect(audioContext.destination);
      
      // Start the oscillator
      oscillator.start();
      
      // Stop the oscillator after 1 second
      setTimeout(() => {
        oscillator.stop();
      }, 300);
  })  
}

export function Result(recognition,navigate,onComposeClick,msg){
    recognition.onresult = function(event) {
        for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            console.log(event.results[i][0].transcript);
            query({"inputs":event.results[i][0].transcript}).then((response) => {
                if(response!==undefined && response.intent!==undefined){
                    console.log(JSON.stringify(response.intent));
                    switch(response.intent){
                        case "list":
                            navigate('/emails/inbox');
                            break;
                        case "trash_list":
                            navigate('/emails/bin');
                            break;                          
                        case "send":
                            onComposeClick();                    
                            break
                        default:
                            beeper();                         
                    }
                }
            });
        }
      }
    };
}

function ComposeInsertData(msg,msgs,recognition1,ct){
    ct.mic=true
    msg.text="You entered:"+ct.final_transcript;
    window.speechSynthesis.speak(msg);
    recognition1.stop(); 
    ct.count+=1;
    var timer = setInterval(function() {
      if (!window.speechSynthesis.speaking){
        clearInterval(timer);        
        msg.text=msgs[3];
        window.speechSynthesis.speak(msg);
        setTimeout(function(){ ct.mic=false;recognition1.start();},3000);
      }
    }, 1000);
}

export function SetupRecognition(ct){
    var SpeechRecognition=window.webkitSpeechRecognition
    var recognition=new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onstart=()=>{
        beeper(250);
        ct.recog=true
        console.log("Start")
    };
    recognition.onend=()=>{
        ct.recog=false
        console.log("Stop");
    };
    recognition.onerror = (event) => {
        ct.recog=false
        console.error('Recognition error:', event.error);
    };

    recognition.addEventListener("speechend", () => {
        console.log("Speech has stopped being detected");
    });
    return recognition;
}

export function Compose(recognition1,ct,msg,msgs,dict,sendEmail,closeComposeMail){
    recognition1.onresult = function(event) {
        var interim_transcript = '';
        var final_transcript='';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            console.log(event.results[i][0].transcript);
            final_transcript += event.results[i][0].transcript;
          } else {
            interim_transcript += event.results[i][0].transcript;
          }
        switch(ct.count){
          case 0:
            var str=(final_transcript+interim_transcript).toLowerCase().replace(/\s+/g, '');
            if (str[str.length-1] === ".")
              str = str.slice(0,-1);
            dict.to=ct.final_transcript+str            
            if (event.results[i].isFinal){
                ct.final_transcript=dict.to
                ComposeInsertData(msg,msgs,recognition1,ct)
            }
            break;         
          case 3:
            dict.subject=ct.final_transcript+final_transcript+interim_transcript;            
            if (event.results[i].isFinal){
                ct.final_transcript=dict.subject
                ComposeInsertData(msg,msgs,recognition1,ct)
            }
            break;          
          case 6:
            dict.body=ct.final_transcript+final_transcript+interim_transcript;            
            if (event.results[i].isFinal){
                ct.final_transcript=dict.body
                ComposeInsertData(msg,msgs,recognition1,ct)
            }
            break;          
          case 1:   
          case 4:
          case 7:
            if (event.results[i].isFinal)
              switch(event.results[i][0].transcript.toLowerCase().replace(/\s+/g, '').replace('.','')){
                case "yes":
                  if(ct.count!==7){
                    ct.count+=2;
                    ct.counter+=1;
                    msg.text=msgs[ct.counter];
                    window.speechSynthesis.speak(msg);
                    recognition1.stop();                   
                    ct.final_transcript='';
                    interim_transcript='';
                  }
                  else{
                    sendEmail();
                  }
                  break;
                case "no":
                  ct.count+=1;                  
                  msg.text=msgs[4];
                  window.speechSynthesis.speak(msg);
                  recognition1.stop();
                  break  
                default:
                  msg.text="Please repeat your statement Yes or No"
                  window.speechSynthesis.speak(msg);
                  recognition1.stop();
                  break;           
            }
            break
          case 2:
          case 5:
          case 8:
            if (event.results[i].isFinal)
            switch(event.results[i][0].transcript.toLowerCase().replace(/\s+/g, '').replace('.','')){
              case "add":
                ct.count-=2;
                msg.text=msgs[ct.counter];
                window.speechSynthesis.speak(msg);
                recognition1.stop(); 
                break;
              case "replace":
                ct.count-=2;
                interim_transcript='';
                ct.final_transcript='';
                msg.text=msgs[ct.counter];
                window.speechSynthesis.speak(msg);
                recognition1.stop(); 
                break;             
              case "cancel":
                closeComposeMail();
                break
              default:
                msg.text="Please repeat your statement Add , Replace or Cancel"
                window.speechSynthesis.speak(msg);
                recognition1.stop(); 
                break;
          }
          break;
          default:
            msg.text="Please repeat your statement"
            window.speechSynthesis.speak(msg);
            recognition1.stop(); 
            break;
        }
      }   
    };
}

export function ListEmail(recog,flag,data,navigate){
  if(data.length>0){
    flag.mic=false
    recog.stop();
    recog.onresult = function(event) {
        for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            console.log(event.results[i][0].transcript);
            switch(event.results[i][0].transcript.toLowerCase().replace(/\s+/g, '').replace('.','')){
              case "read":
                if(window.location.pathname!="/emails/bin"){
                navigate("/view", { state: { email: data[flag.count] }})
                flag.count=0
                flag.mic=false
                recog.stop();
                }
                else{
                  navigate("/deleted", { state: { email: data[flag.count] }})
                  flag.count=0
                  flag.mic=false
                  recog.stop();
                }
                break
              case "next":
                if(window.location.pathname!="/emails/bin"){
                flag.count+=1
                navigate("/emails/inbox")
                }
                else{
                  flag.count+=1
                  navigate("/emails/bin")                  
                }
                break
              case "cancel":
                flag.count=0
                window.location="/emails"
                break
              default:
                beeper();
                break
            }
        }
      }
    }
    var msger = new SpeechSynthesisUtterance();
    if(flag.count<data.length){
      msger.text="From:"+data[flag.count].from.split(' ')[0]+"  ,Subject:"+data[flag.count].subject
      window.speechSynthesis.speak(msger);
    }
    else
      flag.count=0
    var timer = setInterval(function() {
      if (!window.speechSynthesis.speaking &&(window.location.pathname=="/emails/inbox" || window.location.pathname=="/emails/bin")){
        clearInterval(timer);        
        msger.text="Read, Next, Cancel"
        setTimeout(function(){
          if(flag.mic==false){
           flag.mic=true;
           recog.start();
          }
          },3000);
        window.speechSynthesis.speak(msger);
      }
    }, 1000);
  }
}


export function ReadMail(recogn,f,email,trash,star,onForwardClick,onReplyClick){
  var msger = new SpeechSynthesisUtterance();
  recogn.onresult = function(event) {
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
          console.log(event.results[i][0].transcript);
          if(event.results[i][0].transcript.toLowerCase().replace(/\s+/g, '').replace('.','')!="cancel")
            query({"inputs":event.results[i][0].transcript}).then((response) => {
                if(response!==undefined && response.intent!==undefined){
                    console.log(JSON.stringify(response.intent));
                    switch(response.intent){
                        case "forward":
                            onForwardClick();
                            break;
                        case "trash":
                            trash();                            
                            break;
                        case "star":
                            star();
                            break;                            
                        case "reply":
                            onReplyClick();
                            break
                        default:
                            beeper();
                    }
                }
            });
          else
            window.location="/emails/inbox"
      }
    }
  }


  msger.text=email.body
  window.speechSynthesis.speak(msger);
  var timer = setInterval(function() {
    if (!window.speechSynthesis.speaking && window.location.pathname=="/view"){
      clearInterval(timer);        
      msger.text="Star, Trash, Forward, Reply, Cancel."
      setTimeout(function(){ f.mic=true;recogn.start();},5000);
      window.speechSynthesis.speak(msger);
    }
  }, 1000);
}

export function ReadDeleted(recogn,f,email,untrash){
  var msger = new SpeechSynthesisUtterance();
  recogn.onresult = function(event) {
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
          console.log(event.results[i][0].transcript);
          if(event.results[i][0].transcript.toLowerCase().replace(/\s+/g, '').replace('.','')!="cancel")
            query({"inputs":event.results[i][0].transcript}).then((response) => {
                if(response!==undefined && response.intent!==undefined){
                    console.log(JSON.stringify(response.intent));
                    switch(response.intent){
                        case "untrash":
                            untrash();                            
                            break;
                        default:
                            beeper();
                    }
                }
            });
          else
            window.location="/emails/bin"
      }
    }
  }


  msger.text=email.body
  window.speechSynthesis.speak(msger);
  var timer = setInterval(function() {
    if (!window.speechSynthesis.speaking && window.location.pathname=="/deleted"){
      clearInterval(timer);        
      msger.text="Untrash or Cancel."
      setTimeout(function(){ f.mic=true;recogn.start();},3000);
      window.speechSynthesis.speak(msger);
    }
  }, 1000);
}

export function ComposeReply(recognition1,ct,final_transcript,msg,msgs,dict,sendEmail,closeComposeMail){
  recognition1.onresult = function(event) {
      var interim_transcript = '';
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          console.log(event.results[i][0].transcript);
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      switch(ct.count){
        case 0:
          dict.reply_body=(final_transcript+interim_transcript);
          if (event.results[i].isFinal){
            msg.text=msgs[0];
            window.speechSynthesis.speak(msg);
            recognition1.stop(); 
            ct.count+=1;
          }   
          break;          
        case 1:   
          if (event.results[i].isFinal)
            switch(event.results[i][0].transcript.toLowerCase().replace(/\s+/g, '').replace('.','')){
              case "yes":
                sendEmail();              
                break;
              case "no":
                ct.count+=1;
                msg.text=msgs[1];
                window.speechSynthesis.speak(msg);
                recognition1.stop();
                break  
              default:
                msg.text="Please repeat your statement Yes or No"
                window.speechSynthesis.speak(msg);
                recognition1.stop();
                break;           
          }
          break
        case 2:
          if (event.results[i].isFinal)
          switch(event.results[i][0].transcript.toLowerCase().replace(/\s+/g, '').replace('.','')){
            case "retry":
              ct.count-=2;
              interim_transcript='';
              final_transcript='';
              msg.text="Verbalize the reply content";
              window.speechSynthesis.speak(msg);
              recognition1.stop(); 
              break;             
            case "cancel":
              closeComposeMail();
              break
            default:
              msg.text="Please repeat your statement Retry or Cancel"
              window.speechSynthesis.speak(msg);
              recognition1.stop(); 
              break;
        }
        break;
        default:
          msg.text="Please repeat your statement"
          window.speechSynthesis.speak(msg);
          recognition1.stop(); 
          break;
      }
    }   
  };
}

export function ComposeForward(recognition1,ct,final_transcript,msg,msgs,dict,sendEmail,closeComposeMail){
  recognition1.onresult = function(event) {
      var interim_transcript = '';
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          console.log(event.results[i][0].transcript);
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      switch(ct.count){
        case 0:
          var str=(final_transcript+interim_transcript).toLowerCase().replace(/\s+/g, '');
          if (str[str.length-1] === ".")
            str = str.slice(0,-1);
          dict.recipient_list=str;
          if (event.results[i].isFinal){
            msg.text=msgs[0];
            window.speechSynthesis.speak(msg);
            recognition1.stop(); 
            ct.count+=1;
          }   
          break;          
        case 1:   
          if (event.results[i].isFinal)
            switch(event.results[i][0].transcript.toLowerCase().replace(/\s+/g, '').replace('.','')){
              case "yes":
                sendEmail();              
                break;
              case "no":
                ct.count+=1;
                msg.text=msgs[1];
                window.speechSynthesis.speak(msg);
                recognition1.stop();
                break  
              default:
                msg.text="Please repeat your statement Yes or No"
                window.speechSynthesis.speak(msg);
                recognition1.stop();
                break;           
          }
          break
        case 2:
          if (event.results[i].isFinal)
          switch(event.results[i][0].transcript.toLowerCase().replace(/\s+/g, '').replace('.','')){
            case "retry":
              ct.count-=2;
              interim_transcript='';
              final_transcript='';
              msg.text="Please spell out the email address of the recipient";
              window.speechSynthesis.speak(msg);
              recognition1.stop(); 
              break;             
            case "cancel":
              closeComposeMail();
              break
            default:
              msg.text="Please repeat your statement Retry or Cancel"
              window.speechSynthesis.speak(msg);
              recognition1.stop(); 
              break;
        }
        break;
        default:
          msg.text="Please repeat your statement"
          window.speechSynthesis.speak(msg);
          recognition1.stop(); 
          break;
      }
    }   
  };
}