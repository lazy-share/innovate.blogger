var express = require('express');
var path = require('path');
var url = require('url');
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

//首次启动时放开该注释可以创建db和一个example col
//require("./mongodb/script");
//初始化四级联动地址信息
//require('./mongodb/address-script');
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
app.use(bodyParser({uploadDir: path.join(__dirname, 'public/images')}));
app.use(expressSession({
    secret: 'laizhiyuan',
    name: 'bloggerSid',
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: {maxAge: 60*60*1000}, //一个小时
    store: new MongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}));
app.use(function (req, res, next) {
    res.locals.hideSearch = false;
    var hideSearchUrl = ['/login'];
    var currentUri = req.originalUrl;
    for (var index in hideSearchUrl){
        if (currentUri === hideSearchUrl[index]){
            res.locals.hideSearch = true;
            break;
        }
    }
    next();
});

app.use(function (req, res, next) {
    if (req.session.current){
        req.session.touch();
    }else {
        var publicUri = [
            '/','/account/login','/account/logout','/account/register','/account/forget','/account/forget/success',
            '/account/register/success', '/account/registerValidate','/account/encryptValidate',
            '/account/updatePwd'
        ];
        var currentUri = req.originalUrl;
        var isPublicUri = false;
        for (var index in publicUri){
            if (currentUri == publicUri[index]){
                isPublicUri = true;
                break;
            }
        }
        if (!isPublicUri){
            res.redirect('/account/login');
            return;
        }
    }
    res.locals.session = req.session;
    next();
});

/*app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "content-type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    if(req.method == "OPTIONS") {
        res.send("200");
    } else {
        next();
    }
});*/

//load route
require('./routes/example')(app);
require('./routes/comment')(app);
require('./routes/articles_type')(app);
require('./routes/articles')(app);
require('./routes/account_info')(app);
require('./routes/account')(app);
require('./routes/notes')(app);
require('./routes/index')(app);
require('./routes/address')(app);

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
