var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);

const TYPE = {
  HOST: 'host',
  GUEST: 'guest',
}

app.set('view engine', 'ejs');

app.use('/:room/:type(' + TYPE.HOST + '|' + TYPE.GUEST +')', express.static('public'));

app.get('/:room/:type(' + TYPE.HOST + '|' + TYPE.GUEST +')', function(req, res) {
  res.render('index', { room:req.params.room, type: req.params.type});
});

io.on('connection', function(socket) {

  socket.on('join room', function(type, room) {
    socket.join(room);
  });

  socket.on('chat', function(type, room, chat) {
    socket.broadcast.to(room).emit('broad chat', chat);
  });

  socket.on('slide state', function(type, room, state) {
    if (type === TYPE.GUEST) return;
    socket.broadcast.to(room).emit('broad state', state);
  });

  socket.on('slide fragment', function(type, room, fragment) {
    if (type === TYPE.GUEST) return;
    socket.broadcast.to(room).emit('broad fragment', fragment);
  });

  socket.on('slide overview', function(type, room, overview) {
    if (type === TYPE.GUEST) return;
    socket.broadcast.to(room).emit('broad overview', overview);
  });
});
