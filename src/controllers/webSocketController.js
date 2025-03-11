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
		case SocketStatuses.IS_CHATTING:
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
			break;
		default:
			//uhhhhhh
	}
};

module.exports = {
	handleMessage,
	handleClose
	//do I even need more?
};
