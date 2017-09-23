const express = require('express');
const app = express();
const path = require('path');
const url = require('url');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const env = require('./conf/environments');
const sysConf = require('./conf/sys_config');
const fs = require('fs');
const logDirectory = __dirname + '/logs';
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const log4js = require('log4js');
log4js.configure({
    appenders: {
        out: { type: 'stdout' },
        app: { type: 'dateFile', filename: __dirname + '/logs/app.log' },
        error: {type: 'file', filename: __dirname + '/logs/error.log'},
        errors: { type: 'logLevelFilter', appender: 'error', level: 'error' }
    },
    categories: {
        default: { appenders: [ 'out', 'app' ,'errors'], level: 'debug' }
    }
});
app.use(log4js.connectLogger(log4js.getLogger("app"), {level: env === 'pro' ? 'INFO' : 'DEBUG'}));
const log = log4js.getLogger("mongodb");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(bodyParser({uploadDir: path.join(__dirname, 'public/images')}));

const mongoose = require('mongoose');
const dbUrl = 'mongodb://' + sysConf[env].dbUsername + ':' + sysConf[env].dbPwd + '@' + sysConf[env].dbIp + ':' + sysConf[env].dbPort + '/' + sysConf[env].dbDatabase;
mongoose.connect(dbUrl, {useMongoClient: true});
const db = mongoose.connection;
db.on('error', function () {
    log.error('connection mongodb faild...');
    throw new Error('unable to connect to database at ' + sysConf[env].dbDatabase);
});
db.once('open', function () {
    log.info('start mongodb database success!');
    console.log('start mongodb database success!');
});

//解决跨域问题
app.all('/api/web/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control--Headers", "content-type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    if (req.method == "OPTIONS") {
        res.send("200");
    } else {
        next();
    }
});

// 初始化model
const modelPath = path.join(__dirname, '/models');
fs.readdirSync(modelPath).forEach(function(file){
    if (/(.*)\.(js$)/.test(file)) {
        require(modelPath + '/' + file);
    }
});

// 初始化routes
const routesPath = path.join(__dirname, '/routes');
fs.readdirSync(routesPath).forEach(function (file) {
    if (/(.*)\.(js$)/.test(file)) {
        require(routesPath + '/' + file);
    }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {

    res.status(err.status || 500);
    res.json({code: false, msg: '服务器错误', data: {}});
});

module.exports = app;
