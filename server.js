var http = require('http');

var express = require('express');
var socketIo = require('socket.io');

var app = express();

// start server on port 8080
var server = http.createServer(app);
var io = socketIo.listen(server);
server.listen(8080);
app.use(express.static(__dirname + '/'));
console.log("Server running on 127.0.0.1:8080");


var line_history = [];

// when new client connects
io.on('connection', function (socket) {

  // catch client up on drawings from before they arrived
  for (var i in line_history) {
    socket.emit('draw_line', { line: line_history[i] });
  }

  // add new lines to line_history, send to connected clients
  socket.on('draw_line', function (data) {
    line_history.push(data.line);
    io.emit('draw_line', { line: data.line });
  });
});
