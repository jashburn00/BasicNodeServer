const ws = require('ws');
const Socket = require('./utils/Socket');
const { handleMessage, handleClose } = require('./controllers/webSocketController');
let clients = new Map();
let largestKey = 0;


const wss = new ws.Server({
	port: 8080
	//TODO: dynamically determine & host for local network
});

wss.on('connection', (ws) => {
	console.log(`SERVER > New client connected to Server.`);
	
	let newSocket = new Socket(findAvailableID(clients), ws);
	clients.put(newSocket.id, newSocket);
	ws.send(`Welcome to the Server! You are socket ${newSocket.id}.`);

	ws.on('message', (message) => handleMessage(message, ws));

	ws.on('close', () => handleClose(clients, ws, wss));
	
});

function findAvailableID(){
	if(largestKey == Number.MAX_SAFE_INTEGER - 1){
		throw Error('Error - too many active connections.');
	} else {
		largestKey++;
		return largestKey;
	}
}

module.exports = clients;

console.log(`Server is running on port 8080`);
