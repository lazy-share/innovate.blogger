/**
 * Created by laizhiyuan on 2017/9/28.
 *
 * <p>
 *    应用中间件
 * </p>
 *
 */
const env = require('../conf/environments');
const sysConf = require('../conf/sys_config')[env];
const log4js = require('log4js');
const jwt = require("jsonwebtoken");
const result = require("../common/result");
const response = require("../common/response");
const log = log4js.getLogger("security filter");
const mongoose = require('mongoose');

//是否请求了不存在的账号过滤器
exports.isExistsAccount = function (req, res, next) {
    const method = req.method;
    if (method == 'GET') {
        var username = req.query.username;
        if(!username) {
            username = req.body.username;
        }
        if (!username) {
            username = req.params['username'];
        }
        log.debug('===================enter isExistsAccount filter username: ' + username);
        if (username) {
            const AccountInfoModel = mongoose.model('AccountInfoModel');
            AccountInfoModel.findOne({username: username}, function (err, doc) {
                if (err) {
                    log.error('isExistsAccount err! msg:' + err);
                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                    return;
                }
                if (!doc) {
                    res.json(result.json(response.C602.status, response.C602.code, response.C602.msg, null));
                    return;
                }
                next();
            });
        }else {
            res.json(result.json(response.C404.status, response.C404.code, response.C404.msg, null));
        }
    }else {
        next();
    }
};

//应用安全过滤器
exports.security = function (req, res, next) {
    const currentUri = req.originalUrl;
    const privateUriReg = /^\/v1\/api\/(web|admin)\/private\/.*$/;
    if (privateUriReg.test(currentUri)){ //受保护的uri
        const token = req.header("LzyAuthorization");
        jwt.verify(token, sysConf.jwtSecret, function (err, decode) {
            if (err) {  //  时间失效的时候或伪造的token
                res.json(result.json(response.C300.status, response.C300.code, response.C300.msg, null));
                return;
            } else {
                next();
                /*log.info("===============security filter decode: "  + JSON.stringify(decode));
                jwt.sign({username: decode.username, password: decode.password}, sysConf.jwtSecret, { expiresIn : sysConf.jwtValidity}, function (err, token) {
                    if (err){
                        console.log(err);
                        log.error('security filter error: errMsg:' + err);
                        res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                        return;
                    }else {
                        next();
                    }
                });*/
            }
        });
    }else {
        //其它为公开的uri
        next();
    }
};

//解决跨域
exports.crossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:4200');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , LzyAuthorization');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', true);
    next();
};

//404
exports.notFound = function (req, res, next) {
    res.status(200); //设置为200前端人工处理
    res.json(result.json(response.C404.status, response.C404.code, response.C404.msg, null));
    return;
};

//500
exports.sysError = function (err, req, res, next) {
    log.error('global error handle: errMsg:' + err);
    res.status(200);//设置为200前端人工处理
    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
    return;
};

//保证系统不会崩溃
exports.backLine = function () {
    const log = log4js.getLogger("backLine");
    process.on('uncaughtException', function(err) {
        console.log(err);
        log.error(err);
    });
};
