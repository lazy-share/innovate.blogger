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

exports.security = function (req, res, next) {
    const currentUri = req.originalUrl;
    const privateUriReg = /^\/v1\/api\/(web|admin)\/private\/.*$/;
    if (privateUriReg.test(currentUri)){ //受保护的uri
        const token = req.header("lzyauthorization");
        jwt.verify(token, sysConf.jwtSecret, function (err, decode) {
            if (err) {  //  时间失效的时候或伪造的token
                res.json(result.json(response.C300.status, response.C300.code, response.C300.msg, null));
                return;
            } else {
                console.log(JSON.stringify(decode));
                log.info("===============security filter decode: "  + decode);
                jwt.sign({username: decode.username, password: decode.password}, sysConf.jwtSecret, { expiresIn : sysConf.jwtValidity}, function (err, token) {
                    if (err){
                        console.log(err);
                        log.error('security filter error: errMsg:' + err);
                        res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                        return;
                    }else {
                        next();
                    }
                });
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
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
};

//500
exports.sysError = function (err, req, res, next) {
    res.status(err.status || 500);
   // res.json({code: false, msg: '服务器错误', data: {}});
    return;
};

exports.backLine = function () {
    const log = log4js.getLogger("backLine");
    process.on('uncaughtException', function(err) {
        console.log(err);
        log.error(err);
    });
};
