let ws;
let currentUser;

const chat = document.getElementById('chat');
const form = document.getElementById('messageForm');
const loginForm = document.getElementById('login');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nickname = document.getElementById('loginInput').value;
  if (nickname) {
    logIn();
    document.getElementById('loginInput').value = '';
  } else {
    document.getElementById("authentication-error").innerHTML = "необходимо ввести никнейм";
  }
})

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = document.getElementById('message').value;
  const dataToSend = JSON.stringify({message});

  document.getElementById('message').value = '';

  ws.send(dataToSend);
});

function logIn() {
  var credentials = { username: document.getElementById("loginInput").value };

  var request = new XMLHttpRequest();
  request.open("POST", "http://127.0.0.1:8000");
  request.setRequestHeader("Content-Type", "application/json");

  request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE) {
      let status =  request.status;

      if (status === 0 || (status >= 200 && status < 400)) {
        currentUser = credentials.username;

        openSocket(currentUser, credentials);

      } else {
        document.getElementById("authentication-error").innerHTML = "Упс... Кажется что-то пошло не так! Попробуйте снова";
      }
    }
  }
  request.send(JSON.stringify(credentials));
}

function openSocket(currentUser, credentials) {
  if (ws) {
    ws.close();
  }

  ws = new WebSocket('ws://localhost:8081');

  ws.onopen = () => {
    document.querySelector('.overlay').classList.add('hidden');
    document.getElementById('message').focus();
  }

  ws.onmessage = (message) => {

    const gotMessage = JSON.parse(message.data);
    const messageBox = document.getElementById('chat');
    // let fragment = document.createDocumentFragment();

    for (let i = 0; i < gotMessage.length; i++) {
      const mess = gotMessage[i];

      const messageElement = document.createElement('div');
      messageElement.appendChild(document.createTextNode(`${mess.message} ${mess.time}`));
      messageBox.appendChild(messageElement);

      if (i === 0) {
        messageElement.classList.add('mesageSent-first');
      } else {
        messageElement.classList.add('mesageSent')
      }
    }
  }

  ws.onclose = () => {
    
  }
}



  
  
  
  
  
  




