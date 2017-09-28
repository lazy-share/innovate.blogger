/**
 * Created by laizhiyuan on 2017/9/28.
 *
 * <p>
 *   JWT 验证和签名工具
 * </p>
 *
 */
var env = require('../conf/environments');
var sysConnfig = require('../conf/sys_config');
var jwtSecret = sysConnfig[env].jwtSecret;
var jwt = require('jsonwebtoken');
var log = require('log4js').getLogger("jwt_util");
//签名
exports.signature = function (obj) {
    jwt.sign(obj, jwtSecret, { algorithm: 'RS256'}, function (err, token) {
        if (err){
            console.log(err);
            log.error(err);
        }else {
            console.log("token:" + token);
            log.info("token:" + token);
            return token;
        }
    });
    return token;
};
//验证
exports.verify = function (token) {
    jwt.verify(token, jwtSecret, { algorithm: 'RS256'}, function (err, decoded) {
        if (err){
            console.log(err);
            log.error(err);
        }else {
            console.log("token:" + token + "decoded-obj:" + decoded);
            log.info("token:" + token + "decoded-obj:" + decoded);
            return decoded;
        }
    });
};