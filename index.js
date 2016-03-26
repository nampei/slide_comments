'use strict';

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var routes = require('./routes/index');
var auth = require('./routes/auth');
var users = require('./routes/users');
var session = require('express-session');
var passport = require('passport');
var authorized = require('./middleware/auth');

app.use(session({
  secret : 'cuaM6reezu7aechooLoh',
  resave : false,
  saveUninitialized : true,
}));
app.use(passport.initialize());
app.use(passport.session());

// passport
require('./lib/passport')(passport);

// routing
app.use('/login', routes);
app.use('/auth', auth);
app.use('/me', authorized, users);

const PORT = 8080;

server.listen(PORT);

const TYPE = {
  HOST: 'host',
  GUEST: 'guest',
}

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use('/:room/:type(' + TYPE.HOST + '|' + TYPE.GUEST + ')', express.static('public'));

app.get('/:room/:type(' + TYPE.HOST + '|' + TYPE.GUEST + ')', function(req, res) {
  res.render('index', {
    room: req.params.room,
    type: req.params.type
  });
});
app.get('/admin/', function(req, res) {
  res.render('admin', {});
});

io.on('connection', function(socket) {

  socket.on('join room', function(type, room) {
    socket.setRoominfo = room;
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
