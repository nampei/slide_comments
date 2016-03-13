var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
  socket.on('slide state', function(state){
    console.log(JSON.parse(state));
  });
  socket.broadcast.emit('sousin','これが送りたい文字だ！');
  socket.emit('sousin','これが送りたい文字だ！');

  // var socketID = 送りたい相手のソケットID
  // socket.to(socketID).emit(‘sousin’,’これが送りたい文字だ！’);
});
