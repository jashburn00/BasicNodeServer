export class Socket{
    constructor(id, socket){
        this._id = id;
        this._instance = socket;
    }

    get instance(){
        return this._instance;
    }

    get id(){
        return this._id;
    }
}

module.exports = Socket;