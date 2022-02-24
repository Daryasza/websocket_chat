import { createServer } from "http";
import { WebSocketServer } from 'ws';
import {v4 as uuid} from 'uuid';
import { writeFile, readFileSync, existsSync } from 'fs';
const ws = {WebSocketServer};
const clients = {};
const log = existsSync('log') && readFileSync('log');
const messages = JSON.parse(log) || [];
const host = '0.0.0.0';
const port = 8000;
const wss = new WebSocketServer({port:8081});

const requestListener = function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	if (req.method === 'OPTIONS') {
		res.writeHead(200);
		res.end();
		return;
	}
  res.writeHead(200);
  res.end("My first server!");
};

const server = createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});



wss.on('connection', (ws)=> {
  const id = uuid();
  clients[id] = ws;

  ws.send(JSON.stringify(messages));

  ws.on('message', (rawMessage) => {
    const time = `${new Date().getHours()}:${new Date().getMinutes()}`;
    
    const {message} = JSON.parse(rawMessage);

    console.log(time)
    
    messages.push({message, time});

    for (const id in clients) {
      clients[id].send(JSON.stringify([{message, time}]))
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