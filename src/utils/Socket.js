class Socket{
    constructor(id, socket){
        this._id = id;
        this._instance = socket;
        this._status = 'default';
        this._chattingWith = null;
        this._requestedChatBy = null;
        this._requestedChatWith = null;
        this._previousStatus = 'default';
    }

    get requestedChatWith(){
        return this._requestedChatWith;
    }

    set requestedChatWith(val){
        this._requestedChatWith = val;
    }

    get requestedChatBy(){
        return this._requestedChatBy;
    }

    set requestedChatBy(val){
        this._requestedChatBy = val;
    }

    get previousStatus(){
        return this._previousStatus;
    }

    set previousStatus(val){
        this._previousStatus = val;
    }
    
    get instance(){
        return this._instance;
    }

    set instance(val){
        this._instance = val;
    }

    get id(){
        return this._id;
    }

    set id(val){
        this._id = val;
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