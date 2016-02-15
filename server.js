var http = require('http');

var express = require('express');
var socketIo = require('socket.io');

var app = express();

var port = process.env.PORT || 5000;

// start server on port 8080
var server = http.createServer(app);
var io = socketIo.listen(server);
server.listen(port);
app.use(express.static(__dirname + '/'));
console.log('Server running on ' + port);


var line_history = [];

// when new client connects
io.on('connection', function (socket) {
  // catch client up on drawings from before they arrived
  for (var i = 0, lines = line_history.length; i < lines; i++) {
    socket.emit('draw_line', { line: line_history[i] });
  }

  // add new lines to line_history, send to connected clients
  socket.on('draw_line', function (data) {
    line_history.push(data.line);
    io.emit('draw_line', { line: data.line });
  });
});
