/**
 * Created by laizhiyuan on 2017/9/28.
 *
 * <p>
 *    应用初始化工作
 * </p>
 *
 */
const fs = require('fs');
const env = require('../conf/environments');
const sysConf = require('../conf/sys_config')[env];
const log4js = require('log4js');

exports.initLog4js = function (app) {
    log4js.configure(require('../conf/log4js.js'));
    app.use(log4js.connectLogger(log4js.getLogger("app"), {level: env === 'pro' ? 'INFO' : 'DEBUG'}));
};

exports.initModels = function (modelPath) {
    const log = log4js.getLogger("initModels");
    log.info("begin init initModels");
    fs.readdirSync(modelPath).forEach(function(file){
        if (/(.*)\.(js$)/.test(file)) {
            console.log("=======================init models===============>" + modelPath + '/' + file);
            require(modelPath + '/' + file);
        }
    });
};

exports.initRouters = function (router, routerPath) {
    const log = log4js.getLogger("initRouters");
    log.info("begin init initRouters");
    fs.readdirSync(routerPath).forEach(function(file){
        if (/(.*)\.(js$)/.test(file)) {
            console.log("=======================init routers===============>" + routerPath + '/' + file);
            require(routerPath + '/' + file)(router);
        }
    });
};


exports.initMongoDb = function () {
    const log = log4js.getLogger("mongodb");
    //连接mongodb
    const mongoose = require('mongoose');
    const dbUrl = 'mongodb://' + sysConf.dbUsername + ':' + sysConf.dbPwd + '@' + sysConf.dbIp + ':' + sysConf.dbPort + '/' + sysConf.dbDatabase;
    mongoose.connect(dbUrl, {useMongoClient: true});
    const db = mongoose.connection;
    db.on('error', function () {
        log.error('connection mongodb faild...');
        throw new Error('unable to connect to database at ' + sysConf.dbDatabase);
    });
    db.once('open', function () {
        log.info('connection mongodb database success!');
        console.log('connection mongodb database success!');
    });
};

exports.initRedis = function () {
    const log = log4js.getLogger("redis");
    const redis = require('redis');
    const client = redis.createClient(sysConf.redisPort,sysConf.redisIP,sysConf.redisOpts);
    client.on('ready',function(res){
        log.info('connection redis success!');
        console.log('connection redis success!');
    });
};