const ws = require('ws');
const Socket = require('./utils/Socket')
let clients = [];


const wss = new ws.Server({
	port: 8080
});

wss.on('connection', (ws) => {
	console.log(`SERVER > New client connected to Server.`);
	
	let newSocket = new Socket(clients.length, ws);
	clients.push(newSocket); //TODO: move this elsewhere

	ws.send(`Welcome to the Server! You are socket ${clients.length+1}.`);

	ws.on('message', (message) => {
		if(secretPassphrase.test(message) || access){
			if(access){
				console.log(`SERVER > message received.`);
				ws.send(`message received.`);
				handleInput(message, ws);
			} else {
				console.log(`SERVER > message received, user has been granted access.`);
				ws.send(`message received, user has been granted access.`);
				access = true;
				handleInput(message, ws);
			}
		} else {
			console.log(`SERVER > ERROR - UNAUTHORIZED USER`);
			ws.send(`ERROR - UNAUTHORIZED USER`);
		}
	});

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


console.log(`Server is running on port 8080`);



