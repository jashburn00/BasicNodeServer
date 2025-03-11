const { Socket } = require('../utils/Socket.js');
const ws = require('ws');
const SocketStatuses = require('../utils/SocketStatuses.js');
const { clients } = require('./../server.js');

const handleEndChat = (sender) => {
	//end chat for both participants and update statuses
}

const sendMessage = (sender, message) => {
	
}

const handleChatStart = (sender, message) => {
	
}

//TODO: implement these after TODOmap
const handleMessage = (message, sender) => { 
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
		case SocketStatuses.WAS_INVITED_TO_CHAT:
			if(message == 'yes' || message == 'Yes'){
				//start chat and update statuses for both 
				break;
			}else{
				// update statuses for both
				break;
			}
		case SocketStatuses.REQUESTED_TO_CHAT:
			//let them cancel request or ignore message
			break;
		case SocketStatuses.REQUESTED_DRAWING:
			//use switch for drawings
			break;
		case SocketStatuses.DEFAULT:
			//determine intent and handle it
			case()
			break;
		default:
			//uhhhhhh
	}
};

const handleClose = (clients, ws, wss) => {
	if(wss._server && wss._server.listening){
		for(let [id, socket] in clients){
			if (socket.instance === ws) {
				clients.delete(socket.id);
				break;
			}
		}

		if(clients.size == 0){
			console.log(`SERVER > Client disconnected. Server will also close.`);
			wss.close();
		} else {
			console.log(`SERVER > Client disconnected. Still have ${clients.length} clients.`);
		}
	}
}

module.exports = {
	handleMessage,
	handleClose
	//do I even need more?
};
