# BasicNodeServer a.k.a. "chatboing" - LOCAL NETWORK VERSION
A basic implementation of a live chat server (with some other random functions) intended for me to learn and illustrate Node servers and web sockets. <br><br>This branch is designed for use by two separate machines on the same network. You may run into issues if your network has funky "safety" shenanigans like the network I use at work. 

## How To Use
1. For the local network version, you will need to determine your local IP address. Go into src/server.js and change the `localIP` (around line 8) value to your local IP address. You will need to do the same thing for client.js (around line 14). 
2. navigate (from the root directory) to the 'src' folder and use Node to run server.js
    - e.g. <br>`cd src`<br>`node server.js`
3. then, navigate back to the root directory of the cloned project in your terminal and use Node to run the client.js file. <br>*Do this with a different terminal window so you don't have to close the server!*
    - e.g. <br>`cd ..`<br>`node client.js`

## System Requirements
- Node installed
- mocha installed

## Developer TODO list
- Give users the option to deny a chat connection
- create test suite