export async function Inbox() {
    var msger = new SpeechSynthesisUtterance();
    msger.text="Loading Inbox...";
    window.speechSynthesis.speak(msger);
    const response = await fetch(
        "https://127.0.0.1:8080/inbox",
        {
            credentials: "include"
        }
    );
    const result = await response.json();
    return result;
}

export async function Bin() {
    var msger = new SpeechSynthesisUtterance();
    msger.text="Loading Trash...";
    window.speechSynthesis.speak(msger);
    const response = await fetch(
        "https://127.0.0.1:8080/trash_list",
        {
            credentials: "include"
        }
    );
    const result = await response.json();
    return result;
}