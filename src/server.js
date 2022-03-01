const SERVER_HOST = '0.0.0.0';
const HTTP_SERVER_PORT = "8081";

import { writeFile, readFileSync, existsSync } from 'fs';
import { createServer } from "http";
import { WebSocketServer } from 'ws';

const messageDB = existsSync('messageDB.txt') && readFileSync('messageDB.txt');
const messageData = messageDB ? JSON.parse(messageDB) : [];
const authDB = existsSync('authDB.txt') && readFileSync('authDB.txt');
const authData = authDB ? JSON.parse(authDB) : [];

const clients = {};
const currentUsers = [];
let currentPerson = {};

const server = createServer((req, res) => {
  CORS(res);
  switch(req.method) {
    case "OPTIONS":
      res.writeHead(200);
      res.end();
      break;
    case "POST":
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        res.setHeader('X-Auth-Token', auth(body));
        res.writeHead(200);
        res.end();
      });
      break;
    default:
      res.writeHead(405);
      res.end();
      break;
  }
});

server.listen(HTTP_SERVER_PORT, SERVER_HOST);

const wss = new WebSocketServer({
  server: server,
  verifyClient: (info) => {
    let access_token = info.req.url.split('?').pop().split('=').pop();
    if (!access_token) {
      return false;
    } else if (verify(access_token)) {
      return true;
    }
    return false;
}
});
wss.on('connection', (ws, req) => onConnection(ws, req));

function onConnection(ws, req) {
  ws.uniqueID = getUniqueID();
  let username = authData[req.url.split('?').pop().split('=').pop()];
  clients[ws.uniqueID] = {
    "username": username,
    "ws": ws
  };
  ws.on('message', (content) => onMessage(ws, content));
  ws.on('close', (ws) => onClose(ws));

  sendNewUser(ws, username);

}

function onMessage(ws, content) {
  const {type, payload} = JSON.parse(content);

  switch(type) {
    case 'init':
      sendMessage(ws, "init", clients[ws.uniqueID]["username"])
      break;
    case 'message': 
      let usr = payload.usr;
      let text = payload.text;
      let time = payload.time;
      messageData.push({usr, text, time});

      for (let id in clients) {
        sendMessage(clients[id]["ws"], "message", {usr: usr, text: text, time: time});
      }

      break;
    case 'currentUser': 
      usr = payload.usr;
      for (const client in clients) {
        currentPerson.name = userName;
        // currentPerson.photo = img;
        currentUsers.push(currentPerson)

        clients['newUser'].send(JSON.stringify({type: 'currentUser', usr: usr, allUsers: currentUsers}))
        
      }
      break;
      
    case 'userLeft': 
      usr = payload.usr;
      for (const client in clients) {
        clients['newUser'].send(JSON.stringify({type: 'currentUser', usr: usr}))
        delete currentUsers.name;

      }
      break;
  }
}

function onClose() {
  delete clients['newUser'];
}

function CORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Expose-Headers', 'X-Auth-Token');
}

function sendMessage(ws, type, payload) {
  ws.send(JSON.stringify({
    "type": type,
    "payload": payload
  }));
}

function auth(creds) {
  let username = JSON.parse(creds)["username"];
  let access_token = generateString();
  authData[access_token] = username;
  return access_token;
}

function verify(access_token) {
  return authData[access_token] ? true : false;
}

function generateString(len = 32) {
  let id = '';
  let charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  for (let i = 0; i < len; i++ ) {
    id += charset.charAt(Math.floor(Math.random() * len));
  }
  return id;
}

function getUniqueID() {
  return generateString(8) + "-" +
    generateString(8) + "-" +
    generateString(8);
}

process.on('SIGINT', () => {
  wss.close();

  if (messageData && messageData !== []) {
    writeFile('messageDB.txt', JSON.stringify(messageData), err => {
      if(err) {
        console.log(err)
      }
    });
  }
  if (authData && authData !== []) {
    writeFile('authDB.txt', JSON.stringify(authData), err => {
      if(err) {
        console.log(err)
      }
    });
    process.exit();
  }
});



function sendNewUser(ws, username) {

  let currentID = ws.uniqueID;

  for (const id in clients) {
    console.log();

    if (clients[id].ws.uniqueID !== currentID) {
      
      sendMessage(clients[id].ws,'newUser', username)
    }
  }
}

