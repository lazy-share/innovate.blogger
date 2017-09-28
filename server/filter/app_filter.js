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

exports.security = function (req, res, next) {
    const currentUri = req.originalUrl;
    const publicUri = [
        sysConf.webRootUri + '/login',
        sysConf.webRootUri + '/register',
        sysConf.webRootUri + '/forget'
    ];
    for (var uri in publicUri){
        if (currentUri === publicUri[uri]){
            next();
        }else {
            const token = req.headers["LzyAuthorization"];
            console.log('======token=======' + token);
        }
        next();
    }
};

//解决跨域
exports.crossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , LzyAuthorization');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
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
    res.json({code: false, msg: '服务器错误', data: {}});
};

exports.backLine = function () {
    const log = log4js.getLogger("backLine");
    process.on('uncaughtException', function(err) {
        console.log(err);
        log.error(err);
    });
};
