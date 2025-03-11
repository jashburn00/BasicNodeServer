const SocketStatuses = require('../utils/SocketStatuses.js');


const handleMessage = (message) => { 
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


module.exports = {
	handleMessage,
	handleInput,
	handleClose,
	handleChatRequest,
	handleDrawingRequest
};
