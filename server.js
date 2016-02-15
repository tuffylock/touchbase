var http = require('http');

var express = require('express');
var socketIo = require('socket.io');

var app = express();

// start server on port 8080
var server = http.createServer(app);
var io = socketIo.listen(server);
server.listen(8080);
console.log("Server running on 127.0.0.1:8080");
