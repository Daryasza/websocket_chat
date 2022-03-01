import './css/main.css';

import { getAccessToken } from './js/auth.js'
import { initConnect } from './js/websocket.js';
import { getCookie, setCookie, removeCookie } from './js/cookie.js';
import { loadChatPage, loadLoginPage } from './js/page.js'

function main() {
  let access_token = getCookie("access_token");
  console.log(access_token)
  if (!access_token || access_token.length === 0) {
    document.getElementById('login').addEventListener('submit', (e) => {
      e.preventDefault();
      const credentials = {
        username: document.getElementById("loginInput").value
      };
      document.getElementById('loginInput').value = '';
      if (credentials) {
        getAccessToken(credentials)
          .then((access_token) => {
            access_token = access_token
            if (access_token && access_token.length > 0) {
              // for debug purpose we can turn off cookie saving
              setCookie("access_token", access_token);
              _initConnect(access_token);
            } else {
              document.getElementById("authentication-error").innerHTML = "Не удалось выполнить вход.";
            }
          });
      } else {
        document.getElementById("authentication-error").innerHTML = "Необходимо ввести имя пользователя.";
      }
    });
  } else {
    _initConnect(access_token);
  }
}

function _initConnect(access_token) {
  initConnect(access_token)
    .then((e) => {
      // TODO: add HTML loader until message with username is received
      console.log("Connected to server");
    })
    .catch((e) => {
      console.log(e)
      document.getElementById("authentication-error").innerHTML = "Упс... Кажется что-то пошло не так! Попробуйте снова";
      removeCookie("access_token")
      main();
    });
}

main();