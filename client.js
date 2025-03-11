const readline = require('readline');
const ws = require('ws');


const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
rl.on('line', inputHandler);

let input = '';

const socket = new ws.WebSocket('ws://localhost:8080');


socket.on('open', socketOpenHandler);

socket.on('message', messageFromServerHandler);

socket.on('close', closeHandler);


function closeHandler(){
	console.log(`CLIENT > Client is closing.`);
}

function socketOpenHandler(){
	console.log(`CLIENT > Connected to server.`);
}

function messageToServerHandler(data){
	socket.send(data);
}

function messageFromServerHandler(data){
	console.log(`RESPONSE FROM SERVER > ${data}`);
}

function inputHandler(inp){
	input = inp;
	if(input == 'terminate' || input == 'Terminate'){
		rl.close();
		socket.close();
	} else {
		socket.send(input);
	}
}







