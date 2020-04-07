var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var amqp = require('amqplib/callback_api');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);


app.get('/', function (req, res) {

  amqp.connect('amqp://localhost', (err, conn) => {
    conn.createChannel((err, ch) => {
    const q = 'hello';
    ch.assertQueue(q, {durable: false});
    // I suppose the process will take about 5 seconds to finish
    setTimeout(() => {
      let msg = 'Get data from message queue!';
      ch.sendToQueue(q, new Buffer(msg));
      console.log(` [X] Send ${msg}`);
    }, 5000)                       
    });
    // The connection will close in 10 seconds
    setTimeout(() => {
    conn.close();
    }, 10000);
  });
  res.send('Hello World!')
})



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




app.get('/message', function (req, res) {
  res.send('Hello World!')
})

module.exports = app;
