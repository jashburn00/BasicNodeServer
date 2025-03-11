const { Socket } = require('../utils/Socket.js');
const ws = require('ws');
const { statuses } = require('../utils/SocketStatuses.js');
const { clients } = require('./../server.js');

const handleEndChat = (sender) => {
	//end chat for both participants and update statuses
	sender.status = statuses.DEFAULT;
	sender.previousStatus = null;
	sender.instance.send('You have ended the chat session.');

	clients.get(sender.chattingWith).status = statuses.DEFAULT;
	clients.get(sender.chattingWith).previousStatus = null;
	clients.get(sender.chattingWith).instance.send('The chat session was ended by another user.');

	//reset all the chattingWith etc.
	clients.get(sender.chattingWith).chattingWith = null;
	sender.chattingWith = null;
}

const sendChatMessage = (sender, message) => {
	if(sender.chattingWith && typeof Number.isInteger(sender.chattingWith)){
		clients.get(sender.chattingWith).instance.send(message);
	} else {
		sender.instance.send('ERROR - Error sending message.');
	}
}

const handleChatAccepted = (sender) => {
	sender.status = statuses.IS_CHATTING;
	sender.chattingWith = sender.requestedChatBy;
	sender.requestedChatBy = null;

	clients.get(sender.chattingWith).state = statuses.IS_CHATTING;
	clients.get(sender.chattingWith).requestedChatWith = null;
	clients.get(sender.chattingWith).chattingWith = sender.id;

	//notify both
	clients.get(sender.chattingWith).instance.send(`Your request to chat has been accepted! You are now chatting with connection ${sender.id}.`);
	sender.instance.send(`You have accepted the invitation. You are now chatting with connection ${sender.chattingWith}.`);
}

const handleChatDenied = (sender) => {
	sender.status = sender.previousStatus;
	sender.previousStatus = null;
	sender.instance.send('You have denied the chat request.');

	clients.get(sender.requestedChatBy).instance.send('Your request to chat has been denied.');
	clients.get(sender.requestedChatBy).status = clients.get(sender.requestedChatBy).previousStatus;
	clients.get(sender.requestedChatBy).previousStatus = null;
}

const handleCancelMessageRequest = (sender) =>{
	//notify formerly invited party
	clients.get(sender.requestedChatWith).instance.send(`Connection ${sender.id} has cancelled their chat request.`);
	clients.get(sender.requestedChatWith).status = clients.get(sender.requestedChatWith).previousStatus;
	clients.get(sender.requestedChatWith).previousStatus = null;

	sender.instance.send('Your request has been cancelled.');
	sender.status = sender.previousStatus;
	sender.previousStatus = null;
}

const handleChatChoice = (sender, message) => {
	if(!Number.isNaN(parseInt(message))){
		if(clients.has(parseInt(message))){
			sender.chattingWith = parseInt(message);
			sender.status = statuses.IS_CHATTING;
			sender.instance.send(`Your chat has started with connection ${parseInt(message)}.`);
			clients.get(sender.chattingWith).chattingWith = sender.id;
			clients.get(sender.chattingWith).status = statuses.IS_CHATTING;
			clients.get(sender.chattingWith).instance.send(`Your chat has started with connection ${sender.id}.`);
		}
	}
}

const handleDrawing = (sender, message) => {
	switch(message){
		case 'cancel':
			sender.status = statuses.DEFAULT;
			sender.previousStatus = null;
			sender.instance.send('Drawing cancelled.');
			break;
		case 'bionicle 1':
			sender.status = statuses.DEFAULT;
			sender.previousStatus = null;
			sender.instance.send(bionicle1());
			break;
		case 'bionicle 2':
			sender.status = statuses.DEFAULT;
			sender.previousStatus = null;
			sender.instance.send(bionicle2());
			break;
		case 'rabbit':
			sender.status = statuses.DEFAULT;
			sender.previousStatus = null;
			sender.instance.send(rabbit());
			break;
		default:
			sender.instance.send('Unknown option. Options are:\nbionicle 1\nbionicle 2\nrabbit\ncancel');
	}
}

const bionicle1 = () =>{
	return ":( o o ):\n \\    /\n ( O )";
	/*
		:( o o ):
		 \    /
		 ( O )

	*/
}

const bionicle2 = () => {
	return "-----(-_-)-----\n|    |   |    |\n|    |   |    |\n|    |   |    |\n\"    |   |    \"\n   _|    |_";
	/*
		-----(-_-)-----
		|    |   |    |
		|    |   |    |
		|    |   |    |
		"    |   |    "
		   _|    |_

	*/
}

const rabbit = () => {
	return " (\\_/)\n( . .)\no(\")(\")";
	/*
		 (\_/)
		( . .)
		o(")(")

	*/
}

//TODO: write these then necessary handlers
const handleMessage = (message, sender, wss) => { 
	console.log(`handling message ${message} in state ${sender.status} ppppp->${statuses.DEFAULT}`);
	switch (sender.status){
		case statuses.IS_CHATTING:
			if(message == "quit"){
				//end the chat for both sockets
				handleEndChat(sender);
				break;
			} else {
				//send the message
				sendChatMessage(sender, message);
				break;
			}
		case statuses.WAS_INVITED_TO_CHAT:
			if(message == 'yes' || message == 'Yes'){
				handleChatAccepted(sender); 
				break;
			}else{
				// update statuses for both
				handleChatDenied(sender);
				break;
			}
		case statuses.REQUESTED_TO_CHAT:
			//let them cancel request or ignore message
			if(message == 'cancel' || message == 'Cancel'){
				handleCancelMessageRequest(sender);
			} else {
				//remind them how to cancel request
				sender.instance.send('Unrecognized command - enter "cancel" to cancel your chat request.');
			}
			break;
		case statuses.CHOOSING_CHAT_CONNECTION:
			handleChatChoice(sender, message);
			break;
		case statuses.REQUESTED_DRAWING:
			//use switch for drawings
			handleDrawing(sender, message);
			break;
		case statuses.DEFAULT: // 'default'
			console.log('touch');
			//determine intent and handle it
			switch (message){
				case 'chat':
					assistChatInvite(sender);
					break;
				case 'drawing':
					console.log('touch 2');
					sender.status = statuses.REQUESTED_DRAWING;
					handleDrawingRequest(sender);
					break;
				case 'terminate':
					handleClose(clients, sender.instance, wss);
					break;
				default:
					sender.instance.send('Command not recognized. Commands are:\ndrawing\nchat\nterminate\n');
			}
			break;
		default:
			throw Error(`Error - Unrecognized state! State was: ${sender.status}`);
	}
};

const assistChatInvite = (sender) => {
	if(clients.size > 1){
		let ret = 'Please choose one of the following connections to invite to chat:\n';
		for(let [id, socket] of clients){
			if(id != sender.id){
				ret += id+'\n';
			}
		}
		sender.status = statuses.CHOOSING_CHAT_CONNECTION;
		sender.send(ret);
	} else {
		//you so lonely :(
		sender.instance.send('You are the only connection. You cannot chat with yourself unless you have schizophrenia.');
	}
}

const handleDrawingRequest = (sender) => {
	sender.status = statuses.REQUESTED_DRAWING;
	sender.previousStatus = statuses.DEFAULT;
	sender.instance.send('Please enter one of the options:\nbionicle 1\nbionicle 2\nrabbit\ncancel');
}

const handleClose = (clients, socket, wss) => {
	if(wss._server && wss._server.listening){
		clients.delete(socket.id);

		if(clients.size == 0){
			console.log(`SERVER > Client ${ws.id} disconnected. No other sockets are connected. Server will also close.`);
			wss.close();
		} else {
			console.log(`SERVER > Client ${ws.id} disconnected. Still have ${clients.length} clients.`);
		}
	}
}

module.exports = {
	handleMessage,
	handleClose
	//do I even need more?
};
