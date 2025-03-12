const Socket = require('./../utils/Socket');
const ws = require('ws');

const clients = new Map();
let largestKey = 0;


function storeClientConnection(websocket){
    let newSocket = new Socket(findAvailableID(), websocket);
    clients.set(newSocket.id, newSocket);
    newSocket.instance.send(`Welcome to the Server! You are connection ${newSocket.id}.`);
}

function removeClientConnection(socket, wss){
    if(wss._server && wss._server.listening){
		clients.delete(socket.id);

		if(clients.size == 0){
			console.log(`SERVER > Client ${socket.id} disconnected. No other sockets are connected. Server will also close.`);
			wss.close();
		} else {
			console.log(`SERVER > Client ${socket.id} disconnected. Still have ${clients.size} clients.`);
		}
	}
}

function getClients(){
    return clients;
}

function findAvailableID(){
	if(largestKey == Number.MAX_SAFE_INTEGER - 1){
        throw Error('Error - too many active connections.');
	} else {
		largestKey++;
		return largestKey;
	}
}

function getObjectFromSocket(ws){
    for( [id, obj] of clients){
        if(obj.instance === ws){
            return obj;
        }
    }
    return null;
}


module.exports = {
    storeClientConnection,
    removeClientConnection,
    getClients,
    getObjectFromSocket
};