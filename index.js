'use strict';

var express = require('express');
var bodyParser = require('body-parser')
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

app.set('view engine', 'ejs');

// parse application/json
app.use(bodyParser.json())

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
app.use('/slide', slide);

app.use('/public', express.static(__dirname + '/public'));

const PORT = 8080;
server.listen(PORT);
console.log('server started. port:' + PORT);

app.get('/admin/', function(req, res) {
  res.render('admin', {});
});

io.on('connection', function(socket) {

  socket.on('join room', function(type, room) {
    socket.join(room);

    socket.addedType = type;
    socket.addedRoom = room;
  });

  socket.on('chat', function(chat) {
    socket.broadcast.to(socket.addedRoom).emit('broad chat', chat);
  });

  socket.on('slide state', function(state) {
    if (socket.addedType === TYPE.GUEST) return;
    socket.broadcast.to(socket.addedRoom).emit('broad slide', state);
  });

  socket.on('slide refresh', function(state) {
    if (socket.addedType === TYPE.GUEST) return;
    socket.broadcast.to(socket.addedRoom).emit('broad slide-refresh', state);
  });
});
