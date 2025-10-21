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
        iconImg.src="./Brain.png";
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
        const response = await fetch('http://127.0.0.1:8000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        // data.reply
        appendMessage(data.reply,"bot")

    } catch (error) {
        appendMessage('Error: Could not reach the server.','bot');
    } finally{
        sendBtn.disabled=false;
        inputMessage.focus();
    }
    

}

// event
sendBtn.addEventListener("click",sendMessage)
inputMessage.addEventListener("keypress",function (e){
    if (e.key === "Enter") sendMessage();
})

function setupSpeechRecognition() {
    const micButton = document.getElementById("btnRecord");
    const chatInput = document.getElementById("inputMessage"); // Dùng chatInput, không phải inputMessage
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
        console.log("Trình duyệt hỗ trợ Speech Recognition.");
        const recognition = new SpeechRecognition();

        recognition.lang = 'vi-VN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        // Khi bắt đầu ghi âm, thêm class 'listening'
        recognition.onstart = () => {
            console.log("Bắt đầu nhận dạng giọng nói...");
            micButton.classList.add("listening");
            chatInput.placeholder = "Hãy nói cho tôi nghe đi...";
        };

        // Khi kết thúc ghi âm, xóa class 'listening'
        recognition.onend = () => {
            console.log("Kết thúc nhận dạng giọng nói.");
            micButton.classList.remove("listening");
            chatInput.placeholder = "Tôi ở đây để giúp bạn...";
        };

        // Xử lý khi có kết quả
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatInput.value = transcript;
            sendMessage(); // Tự động gửi
        };

        // Xử lý lỗi
        recognition.onerror = (event) => {
            console.error("Lỗi nhận dạng giọng nói: ", event.error);
            micButton.classList.remove("listening");
            chatInput.placeholder = "Bạn có thể nói lại được không?";
        };

        // Thêm sự kiện 'click' cho nút micro
        micButton.addEventListener('click', () => {
            if (!micButton.classList.contains("listening")) {
                try {
                    recognition.start();
                } catch (e) {
                    console.error("Lỗi khi bắt đầu nhận dạng: ", e);
                }
            } else {
                recognition.stop();
            }
        });

    } else {
        console.warn("Trình duyệt này không hỗ trợ Speech Recognition.");
        micButton.style.display = "none";
    }
}
// --- GỌI HÀM ĐỂ KÍCH HOẠT SPEECH RECOGNITION ---
setupSpeechRecognition();



