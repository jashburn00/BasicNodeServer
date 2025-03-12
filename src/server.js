const ws = require('ws');
const Socket = require('./utils/Socket');
const { handleMessage } = require('./controllers/webSocketController');
const { storeClientConnection, removeClientConnection, getClients, getObjectFromSocket } = require('./controllers/clientsController.js');

const wss = new ws.Server({
	port: 8080
	//TODO: fix circular dependency
	//TODO: dynamically determine & host for local network
});

wss.on('connection', (ws) => {
	console.log(`SERVER > New client connected to Server.`);
	
	storeClientConnection(ws);

	ws.on('message', (message) => handleMessage(message, getObjectFromSocket(ws), wss));

	ws.on('close', () => removeClientConnection(getObjectFromSocket(ws), wss));
	
});

console.log(`Server is running on port 8080`);
