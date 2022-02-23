import { WebSocketServer } from 'ws';
import {v4 as uuid} from 'uuid';
import { writeFile, readFileSync, existsSync } from 'fs';
const ws = {WebSocketServer};
const clients = {};
const log = existsSync('log') && readFileSync('log');
const messages = JSON.parse(log) || [];


const wss = new WebSocketServer({port:8081})

wss.on('connection', (ws)=> {
  const id = uuid();
  clients[id] = ws;

  ws.send(JSON.stringify(messages));

  ws.on('message', (rawMessage) => {
    const {message} = JSON.parse(rawMessage);

    messages.push({message});

    for (const id in clients) {
      clients[id].send(JSON.stringify([{message}]))
    }
  })

  ws.on('close', () => {
    delete clients[id];
  })
})

process.on('SIGINT', () => {
  wss.close();

  writeFile('log', JSON.stringify(messages), err => {
    if(err) {
      console.log(err)
    }
    process.exit();
  })
  
})