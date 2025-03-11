const { Socket } = require('../utils/Socket.js');
const ws = require('ws');
const statuses = require('../utils/SocketStatuses.js');
const { clients } = require('./../server.js');

const handleEndChat = (sender) => {
	//end chat for both participants and update statuses
}

const sendMessage = (sender, message) => {
	
}

const handleChatStart = (sender, message) => {
	
}

//TODO: implement these after TODOmap
const handleMessage = (message, sender, wss) => { 
	switch (sender.status){
		case statuses.IS_CHATTING:
			if(message == "quit"){
				//end the chat for both sockets
				handleEndChat(sender);
				break;
			} else {
				//send the message
				sendMessage(sender, message);
				break;
			}
		case statuses.WAS_INVITED_TO_CHAT:
			if(message == 'yes' || message == 'Yes'){
				//start chat and update statuses for both 
				break;
			}else{
				// update statuses for both
				break;
			}
		case statuses.REQUESTED_TO_CHAT:
			//let them cancel request or ignore message
			break;
		case statuses.REQUESTED_DRAWING:
			//use switch for drawings
			break;
		case statuses.DEFAULT:
			//determine intent and handle it
			switch (message){
				case 'chat':
					assistChatInvite(sender);
					break;
				case 'drawing':
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
			throw Error('Error - Unrecognized state!');
	}
};

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
