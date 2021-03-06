const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const socket = require('socket.io');

// Register routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const chatListener = require('./sockets/chat');

// App configurations
const app = express();
const server = http.Server(app);
const io = socket(server);

// When a new connection occurs between our server and client
const onlineUsers = {};
const channels = { General: [] }

io.on('connection', (socket) => {
    socket.emit('get online users', onlineUsers);
    chatListener(io, socket, onlineUsers, channels);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Route middleware to be applied to every request
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Register custom routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Set the server to start listening
server.listen('3000', () => {
    console.log('Server listening on port 3000');
});

module.exports = app;
