const ws = require('ws');
let clients = [];

const secretPassphrase = /^tango/;
var access = false;

const wss = new ws.Server({
	port: 8080
});

wss.on('connection', (ws) => {
	console.log(`SERVER > New client connected to Server.`);
	clients.push(ws);

	ws.send(`Welcome to the Server! Ready for commands.`);

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
			


console.log(`Server is running on port 8080`);



