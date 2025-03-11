export class Socket{
    constructor(id, socket){
        this._id = id;
        this._instance = socket;
        this._status = 'default';
        this._chattingWith = null;
        this._requestedChatBy = null;
        this._previousStatus = 'default';
    }

    get instance(){
        return this._instance;
    }

    get id(){
        return this._id;
    }

    get status(){
        return this._status;
    }

    set status(ns){
        this._status = ns;
    }

    get chattingWith(){
        return this._chattingWith;
    }

    set chattingWith(val){
        this._chattingWith = val;
    }
}

module.exports = Socket;