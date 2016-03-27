'use strict';

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// const
var TYPE = require('./const/type');

// routes
var routes = require('./routes/index');
var auth = require('./routes/auth');
var users = require('./routes/users');
var slide = require('./routes/slide');

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
app.use('/:room/:type(' + TYPE.HOST + '|' + TYPE.GUEST + ')', slide);

const PORT = 8080;

server.listen(PORT);

console.log('server started. port:' + PORT);

app.set('view engine', 'ejs');

app.use('/public', express.static(__dirname + '/public'));

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
