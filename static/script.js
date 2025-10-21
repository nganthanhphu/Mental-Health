const inputMessage = document.getElementById("inputMessage");
const sendBtn = document.getElementById("sendBtn");
const chatbox = document.getElementById("chatbox");


function appendMessage(text,sender){
    const msgDiv =document.createElement("div");
    msgDiv.classList.add("message",sender);

    const textBubble=document.createElement("span");
    textBubble.classList.add("text-bubble");
    textBubble.textContent=text;

    if(sender=="bot"){
        const iconImg=document.createElement("img");
        iconImg.src="/static/icon.png";
        iconImg.classList.add("bot-chat-logo");
        iconImg.alt="MentalHealth Chatbot Logo";
        msgDiv.appendChild(iconImg);
    }

    msgDiv.appendChild(textBubble);
    chatbox.appendChild(msgDiv);
    chatbox.scrollTop=chatbox.scrollHeight;
}



async function sendMessage(){
    const message=inputMessage.value.trim();

    if(!message) return ; 
    appendMessage(message,"user");
    inputMessage.value = '';
    sendBtn.disabled=true;


    try {
        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: "user", content: message }),
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        appendMessage(data.content,"bot")

    } catch (error) {
        appendMessage('Error: Could not reach the server.','bot');
    } finally{
        sendBtn.disabled=false;
        inputMessage.focus();
    }
    

}

sendBtn.addEventListener("click",sendMessage)
inputMessage.addEventListener("keypress",function (e){
    if (e.key === "Enter") sendMessage();
})

function setupSpeechRecognition() {
    const micButton = document.getElementById("btnRecord");
    const chatInput = document.getElementById("inputMessage");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();

        recognition.lang = 'vi-VN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            micButton.classList.add("listening");
            chatInput.placeholder = "Hãy nói cho tôi nghe đi...";
        };

        recognition.onend = () => {
            micButton.classList.remove("listening");
            chatInput.placeholder = "Tôi ở đây để giúp bạn...";
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatInput.value = transcript;
            sendMessage();
        };

        recognition.onerror = (event) => {
            micButton.classList.remove("listening");
            chatInput.placeholder = "Bạn có thể nói lại được không?";
        };

        micButton.addEventListener('click', () => {
            if (!micButton.classList.contains("listening")) {
                try {
                    recognition.start();
                } catch (e) {
                }
            } else {
                recognition.stop();
            }
        });

    } else {
        micButton.style.display = "none";
    }
}

setupSpeechRecognition();



