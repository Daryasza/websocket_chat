import { loadChatPage, newUser, addMessage } from "./page.js";
import { SERVER_DOMAIN, WS_SERVER_PORT } from './env.js';

const WS_SERVER_URL = "ws://" + SERVER_DOMAIN + ":" + WS_SERVER_PORT
let ws;

function initConnect(access_token) {
  ws = new WebSocket(WS_SERVER_URL + '?access_token=' + access_token);
  ws.onmessage = e => onMessage(e);
  ws.onclose = e => onClose(e);
  return new Promise((resolve, reject) => {
    ws.onopen = e => {
      sendMessage("init", "");
      resolve(e);
    };
    ws.onerror = e => {
      reject(e);
    };
  });
}

function initMessageHandler(payload) {
  loadChatPage(payload);


}

function onMessage(message) {
  const json = JSON.parse(message.data);
  console.log(json.payload)
  switch(json.type) {
    case "init":
      initMessageHandler(json.payload);

      break;
    case "message":
      addMessage(
        json.payload.usr,
        json.payload.text,
        json.payload.time
      );
      break;
    case 'newUser': 
      let username = json.payload;
      newUser(username);
      break;

    case 'userLeft': 
      if (access_token != gotMessage.usr) {
        messageElement.appendChild(document.createTextNode(`${gotMessage.usr} left chat`));
        fragment.appendChild(messageElement);
      }
    break;

    default: 
      
  }

  
}

function onClose() {
// ws.send(JSON.stringify({
//   type: 'userLeft',
//   payload: {
//     user: currentUser
//   }
// }))
}

function sendMessage(type, payload) {
  ws.send(JSON.stringify({
    "type": type,
    "payload": payload
  }));
}



export {
  initConnect,
  sendMessage
}