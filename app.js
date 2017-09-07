var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')({session: expressSession});
var dbConfig = require('./mongodb/config').DB;
var mongoose = require('mongoose');
var dbUrl = 'mongodb://' + dbConfig.username + ':' + dbConfig.password + '@' + dbConfig.ip + ':' + dbConfig.port + '/' + dbConfig.database;
mongoose.connect(dbUrl, {useMongoClient: true});

//首次启动时放开该注释
//require("./mongodb/script");
var app = express();

// view engine setup
app.set('views',path.join(__dirname , 'views') );
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
    secret: 'laizhiyuan',
    name: 'blogger-sid',
    cookie: {maxAge: 60*60*1000}, //一个小时
    store: new MongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}));

//load route
require('./routes/example')(app);
require('./routes/comment')(app);
require('./routes/articles_type')(app);
require('./routes/articles')(app);
require('./routes/account_info')(app);
require('./routes/account')(app);
require('./routes/notes')(app);
require('./routes/index')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
