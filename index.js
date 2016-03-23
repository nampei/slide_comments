var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);

app.set('view engine', 'ejs');

app.use('/:room/:type(host|guest)', express.static('public'));

app.get('/:room/:type(host|guest)', function(req, res) {
  res.render('index', { room:req.params.room, type: req.params.type});
});

io.on('connection', function(socket) {

  socket.on('join room', function(type, room) {
    socket.join(room);
  });

  socket.on('chat', function(type, room, chat) {
    console.log(JSON.parse(chat));
    socket.broadcast.to(room).emit('broad chat', chat);
  });

  socket.on('slide state', function(type, room, state) {
    console.log(JSON.parse(state));
    socket.broadcast.to(room).emit('broad state', state);
  });

  socket.on('slide fragment', function(type, room, fragment) {
    console.log(JSON.parse(fragment));
    socket.broadcast.to(room).emit('broad fragment', fragment);
  });

  socket.on('slide overview', function(type, room, overview) {
    console.log(JSON.parse(overview));
    socket.broadcast.to(room).emit('broad overview', overview);
  });
});
