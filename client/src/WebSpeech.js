async function query(data) {
    const response = await fetch(
        "http://localhost:5000/intent",
        {
            headers: {'Content-Type': 'application/json'},
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.json();
    return result;
}

export function Result(recognition,navigate,onComposeClick,msg){
    recognition.onresult = function(event) {
        for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            console.log(event.results[i][0].transcript);
            query({"inputs":event.results[i][0].transcript}).then((response) => {
                if(response!==undefined && response[0]!==undefined && response[0][0].label!==undefined){
                    console.log(JSON.stringify(response[0][0].label));
                    switch(response[0][0].label){
                        case "list":
                            navigate('/emails/inbox');
                            break;
                        case "trash-list":
                            navigate('/emails/bin');
                            break;
                        case "star":
                            navigate('/emails/starred');
                            break;                            
                        case "send":
                            onComposeClick();                    
                            break
                        default:
                            msg.text=response[0][0].label;
                            window.speechSynthesis.speak(msg);
                    }
                }
            });
        }
        }
    };
}

function ComposeInsertData(msg,msgs,recognition1,ct){
    msg.text=msgs[3];
    window.speechSynthesis.speak(msg);
    recognition1.stop(); 
    ct.count+=1;
}

export function SetupRecognition(){
    var SpeechRecognition=window.webkitSpeechRecognition
    var recognition=new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onstart=()=>{
        console.log("Start")
    };
    recognition.onend=()=>{
        console.log("Stop");
    };
    recognition.onerror = (event) => {
        console.error('Recognition error:', event.error);
    };

    recognition.addEventListener("speechend", () => {
        console.log("Speech has stopped being detected");
    });
    return recognition;
}

export function Compose(recognition1,ct,final_transcript,msg,msgs,dict,sendEmail,closeComposeMail){
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
            dict.to=(final_transcript+interim_transcript).toLowerCase().replace(/\s+/g, '');
            if (event.results[i].isFinal)
                ComposeInsertData(msg,msgs,recognition1,ct)
            break;         
          case 3:
            dict.subject=final_transcript+interim_transcript;
            if (event.results[i].isFinal)
                ComposeInsertData(msg,msgs,recognition1,ct)
            break;          
          case 6:
            dict.body=final_transcript+interim_transcript;
            if (event.results[i].isFinal)
                ComposeInsertData(msg,msgs,recognition1,ct)
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
                    final_transcript='';
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
                final_transcript='';
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