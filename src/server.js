const ws = require('ws');
const Socket = require('./utils/Socket');
const { handleMessage } = require('./controllers/webSocketController');
let clients = [];//TODO: make this a map (Do this first)


const wss = new ws.Server({
	port: 8080
	//TODO: dynamically determine & host for local network
});

//TODO: (do this last) use new modules
wss.on('connection', (ws) => {
	console.log(`SERVER > New client connected to Server.`);
	
	let newSocket = new Socket(clients.length+1, ws);
	clients.push(newSocket);
	ws.send(`Welcome to the Server! You are socket ${clients.length+1}.`);

	ws.on('message', (message) => handleMessage(message, ws));

	ws.on('close', () => {
		clients = clients.filter(client => client !== ws);

		if(clients.length == 0){
			console.log(`SERVER > Client disconnected. Server will also close.`);
			wss.close();
		} else {
			console.log(`SERVER > Client disconnected. Still have ${clients.length} clients.`);
		}
	});
});

const handleChatRequest = (socket) => {
	if(clients.length == 0){
		socket.send('You are the only active connection. You have no one to chat with.');
	} else {
		socket.send('Choose from the list of active connections to request a chat session: ');
	}
}

const handleDrawRequest = (socket) => {

}

const handleInput = (inp, socket) => {
	switch (inp){
		case 'chat':
			handleChatRequest(socket);
			break;
		case 'draw':
			handleDrawRequest(socket);
			break;
		default:
			socket.send('Unrecognized command.');
	}
}	


module.exports = clients;

console.log(`Server is running on port 8080`);
