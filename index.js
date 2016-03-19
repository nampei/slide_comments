var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  socket.on('chat', function(chat) {
    console.log(JSON.parse(chat));
    socket.broadcast.emit('broad chat', chat);
  });

  socket.on('slide state', function(state) {
    console.log(JSON.parse(state));
    socket.broadcast.emit('broad state', state);
  });

  socket.on('slide fragment', function(fragment) {
    console.log(JSON.parse(fragment));
    socket.broadcast.emit('broad fragment', fragment);
  });

  socket.on('slide overview', function(overview) {
    console.log(JSON.parse(overview));
    socket.broadcast.emit('broad overview', overview);
  });
});
