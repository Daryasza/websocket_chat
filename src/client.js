// import './css/main.scss'

const chat = document.getElementById('chat');
const form = document.getElementById('messageForm');
let ws = new WebSocket('ws://localhost:8081');
const loginForm = document.getElementById('login');

// loginForm.addEventListener('submit', (e) => {
//   e.preventDefault();

//   const nickname = document.getElementById('loginInput').value;
//   if (nickname) {
   
//   }
//   document.getElementById('loginInput').value = '';
//   sendLogin();

//   async function sendLogin() {
//     const readyState = await ws.readyState === 1;
//     ws.send = (nickname);

//   }
  

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;
  
    const dataToSend = JSON.stringify({message});
  
    // document.getElementById('name').value = '';
    document.getElementById('message').value = '';
  
    ws.send(dataToSend);
  });
  
  ws.onopen = () => {
  }
  
  ws.onmessage = (message) => {
    const gotMessage = JSON.parse(message.data);
    const messageBox = document.getElementById('chat');
    // let fragment = document.createDocumentFragment();
  
    gotMessage.forEach(mess => {
      const messageElement = document.createElement('div');
      messageElement.appendChild(document.createTextNode(`${mess.message}`));
      messageBox.appendChild(messageElement)
    })
  
  }
  
  ws.onclose = () => {
    
  }




