const ws = require('ws');
const Socket = require('./utils/Socket');
const { handleMessage } = require('./controllers/webSocketController');
const { storeClientConnection, removeClientConnection, getClients, getObjectFromSocket } = require('./controllers/clientsController.js');
const http = require('http');

//TODO: you will need to change this value 
const localIP = '123.123.123.123';
const port = 8080;
const server = http.createServer((req, res) => {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('hello, websocket server!');
})
const wss = new ws.Server({server});


wss.on('connection', (ws) => {
	console.log(`SERVER > New client connected to Server.`);
	
	storeClientConnection(ws);

	ws.on('message', (message) => handleMessage(message, getObjectFromSocket(ws), wss));

	ws.on('close', () => removeClientConnection(getObjectFromSocket(ws), wss));
	
});

server.listen(port, localIP, () => {
	console.log('dat new shii');
});

console.log(`Server is running on port 8080`);
