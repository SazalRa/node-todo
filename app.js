var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var about = require('./routes/about') ;
var blog = require('./routes/blog');
var chat = require('./routes/chat.js');


//var bookshelf = require('./routes/bookshelf');

var app = express();
app.use(express.static(__dirname + '/bower_components'));

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(8080);

io.on('connection', function(client) {
  console.log('Client connected...');


  client.on('join',function(data){
    //client.broadcast.emit = data ;
    io.emit('message',data);
  });

});

// DB CONFIG
var dbConfig = {
  client : 'mysql',
  connection : {
    host: 'localhost',
    user:'root',
    password:'root',
    database : 'nodeapp_db',
    charset : 'utf8'
  },
}
var knex = require('knex')(dbConfig);
var bookshelf = require('bookshelf')(knex);
//app.set('bookshelf',bookshelf);

var allowCrossDomain = function(req,res,next){
  res.header('ccess-Control-Allow-Origin', '*');
  next();
};
app.use(allowCrossDomain);
app.locals.videoData = require('./videodata');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/about',about);
app.use('/blog',blog);
app.use('/chat',chat);



app.use(express.static(path.join(__dirname, 'public')));

//app.use('/article',article)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




module.exports = app;


