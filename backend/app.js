const { error } = require('console');
const express = require('express');

var webSocketServer = require('websocket').server;
var webSocketClient = require('websocket').client;

const app = express();


var http = require('http');
const { connection } = require('websocket');

var server = http.createServer( (req , res) =>{
    console.log((new Date()) + 'Received Request for ' + req.url);
    res.writeHead(404);
    res.end();
});

var client = new webSocketClient();

server.listen(8080 , () => {
    console.log('Server listening on port 8080');
});

var wsServer = new webSocketServer({
    httpServer:server,
    autoAcceptConnections:false,
})

wsServer.on('request',(req) => {
    var connection = req.accept('echo-protocol', req.origin);
    console.log((new Date()) + ' Connection accepted.');

    connection.on('message' , message =>{
        console.log(message);
    });

    connection.on('close' , (reasonCode,description) => {
        console.log((new Date()) + 'Peer' + connection.remoteAddress + 'disconnected');
    })
});


client.on("connectFailed" , (error) => {
    console.log('Connect Error : ' + error.toString());
});

client.on('connect' , (connection) => {
    console.log('WebSocket Client Connected');


    connection.on('close' , () => {
        console.log('Connection Closed');
    });

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });

});

app.get("/messages" , (req,res) => {
    res.send('Messages');
})




client.connect('ws://localhost:8080/', 'echo-protocol');