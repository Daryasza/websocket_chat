import { sendMessage } from './websocket.js'

function addMessage(user, text, time) {
  const messageBox = document.getElementById('chat');
  let fragment = document.createDocumentFragment();
  const messageElement = document.createElement('div');

  messageElement.appendChild(
    document.createTextNode(`${user}: ${text} ${time}`)
  );
  fragment.appendChild(messageElement);

  messageBox.append(fragment);
}

function newUser(username) {
  const messageBox = document.getElementById('chat');
  const messageElement = document.createElement('div');

  messageElement.appendChild(
    document.createTextNode(`${username} joined chat!`)
  );

  messageBox.append(messageElement);
}

function loadChatPage(username) {
  document.querySelector('.overlay').classList.add('hidden');
  document.querySelector('.container').classList.remove('hidden');
  document.getElementById('message').focus();

  document.querySelector('[data-role="current-user"]').innerHTML = username;
  
  const ul = document.querySelector('.users');
  const li =  document.createElement('li');
  let img = document.createElement('img');
  let userInfo = document.createElement('div');
  let userNick = document.createElement('div');
  userNick.innerHTML = username;
  let userLastMess = document.createElement('div');

  ul.append(li);
  li.append(img)
  li.append(userInfo)
  userInfo.append(userNick)
  userInfo.append(userLastMess)
  
  document.getElementById('messageForm').addEventListener('submit', (e) => {
    e.preventDefault();
  
    if (message) {
      sendMessage(
        "message",
        {
          usr: username,
          text: document.getElementById('message').value,
          time: `${new Date().getHours()}:${new Date().getMinutes()}`
        }
      );
      document.getElementById('message').value = '';
    }
  });
}


export {
  loadChatPage,
  newUser,
  addMessage
}