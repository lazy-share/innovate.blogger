/**
 * Created by lzy on 2017/9/2.
 *
 * <p>账号服务层
 */
var mongoose = require('mongoose');
var AccountModel = mongoose.model('AccountModel');
var AccountInfoModel = mongoose.model('AccountInfoModel');
var crypto = require('crypto');
var result = require('../common/result');
var response = require('../common/response');
var log = require('log4js').getLogger('account');
var env = require('../conf/environments');
var sysConnfig = require('../conf/sys_config');
var jwtSecret = sysConnfig[env].jwtSecret;
var jwtValidity = sysConnfig[env].jwtValidity;
var jwt = require('jsonwebtoken');
var fs = require("fs");

//注册验证
exports.registerValidate = function (req, res) {
    var username = req.query.username;
    log.info('==============>registerValidate request params:' + username);
    if (username){
        AccountModel.findOne({username: username}, function (err, doc) {
            if (err){
                console.log('registerValidate err! msg:' + err);
                log.error('registerValidate err! msg:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            if (doc){
                res.json(result.json(response.C600.status, response.C600.code, response.C600.msg, null));
                return;
            }else {
                log.info('==============>registerValidate response');
                res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, null));
                return;
            }
        })
    }else {
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
    }
};

//注册
exports.register = function (req, res) {
    var nowTime = new Date();
    log.info('==============enter register nowTime '+ nowTime +'==================');
    log.info('注册请求参数：' + JSON.stringify(req.body.account));
    var account = new AccountModel(req.body.account);
    account.set('password', hashPwd(req.body.account.password));
    account.set('update_time', nowTime);
    account.set('create_time', nowTime);
    account.set('head_portrait', sysConnfig[env].thisDoman + sysConnfig[env].upload_header_dir + '/initHead.jpg');

    account.save(function (err) {
        if (err){
            console.log('save account! errMsg: ' + err);
            log.error('save account! errMsg: ' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }else {
            log.info('注册成功，账号为:' + account.username);
            AccountModel.findOne({username: account.username, password: account.password}).exec(function (err, newAcc) {
                if (err){
                    log.error('save account after select! errMsg: ' + err);
                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                    return;
                }
                var accoutInfo = new AccountInfoModel();
                accoutInfo.set('account_id', newAcc._id);
                accoutInfo.set('create_time', nowTime);
                accoutInfo.set('update_time', nowTime);
                var AddressModel = mongoose.model('AddressModel');
                accoutInfo.set('address', new AddressModel({details: ''}));
                accoutInfo.save(function (err) {
                    if (err){
                        res.statusCode = 500;
                        console.log('save accountInfo error! errMsg: ' + err);
                        log.error('save accountInfo! errMsg: ' + err);
                        res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                        return;
                    }
                    res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, null));
                });
            });
        }
    });

};

function hashPwd(pwd){
    if (pwd){
        return crypto.createHash('sha256').update(pwd).digest('base64').toString();
    }
    console.log('[Warning]: pwd is null or empty...');
    return pwd;
}

//验证密保
exports.forgetValidate = function (req, res) {
    var encrypted = req.query.encrypted;
    var username = req.query.username;
    if (!encrypted || !username){
        log.error("forgetValidate error: msg: params is null or empty|" + encrypted + '|' + username);
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    AccountModel.findOne({username: username})
        .exec(function (err, doc) {
            if (err){
                console.log('forgetValidate error , msg: ' + err);
                log.error('forgetValidate error! errMsg: ' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            if (!doc){
                res.json(result.json(response.C602.status, response.C602.code, response.C602.msg, null));
                return;
            }
            if (!(doc.encrypted == encrypted)){
                res.json(result.json(response.C603.status, response.C603.code, response.C603.msg, null));
                return;
            }else {
                res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, null));
                return;
            }
        })
};

//忘记密码
exports.forget = function (req, res) {
    var username = req.body.username;
    var pwd = hashPwd(req.body.password);
    AccountModel.update({username: username}, {$set: {password: pwd}})
        .exec(function (err) {
            if (err){
                console.log('updatePwd error , msg: ' + err);
                log.error('updatePwd error , msg: ' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, null));
        });
};

//登录
exports.login = function (req, res) {
    var username = req.body.username;
    log.info('==============login request params:' + username);
    AccountModel.findOne({username: username})
        .exec(function (err, doc) {
            if (err){
                console.log('login error , msg: ' + err);
                log.error('login error , msg: ' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            if (doc){
                if (doc.password === hashPwd(req.body.password.toString())){
                    const currentTime = Date.now();
                    doc.last_login_time = doc.current_login_time;
                    doc.current_login_time = currentTime;
                    jwt.sign({username: doc.username, password: doc.password}, jwtSecret, { expiresIn : jwtValidity}, function (err, token) {
                        if (err){
                            console.log(err);
                            log.error('login error: errMsg:' + err);
                            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                            return;
                        }else {
                            log.info('=============create token ' + token + ' for '+ username);
                            doc.token = token;
                            doc.save(function (err, doc) {
                                if (err){
                                    console.log('login error , msg: ' + err);
                                    log.error('login error , msg: ' + err);
                                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                                    return;
                                }
                                log.info("============= login after doc:" + doc);
                                res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, doc));
                            });
                        }
                    });
                }else {
                    res.json(result.json(response.C604.status, response.C604.code, response.C604.msg, null));
                    return;
                }
            }else {
                res.json(result.json(response.C602.status, response.C602.code, response.C602.msg, null));
            }
        });
};

exports.interspace = function (req, res) {
    var id = req.query.account_id;
    if (!id){
        log.error('interspace params error' + id);
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    AccountModel.findOne({_id: id}).exec(function (err, doc) {
        if (err){
            log.error('interspace error' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, doc.interspace_name));
    });
};

//上传头像
exports.uploadHead = function (req, res) {
    var id = req.params.id;
    log.info("====================enter uploadHead, params: " + id);
    if (id) {
        var multiparty = require('multiparty');
        var util = require('util');
        //生成multiparty对象，并配置上传目标路径
        var form = new multiparty.Form({uploadDir: sysConnfig[env].upload_root_dir + sysConnfig[env].upload_header_dir});
        //上传完成后处理
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.log('uploadPic error: ' + err);
                log.error("uploadPic error: " + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            } else {
                var inputFile = files.uploadfile[0];
                var oldFilePath = inputFile.path;
                if (oldFilePath.indexOf('\\') > -1) {
                    oldFilePath = oldFilePath.replace(/\\/g, '/');
                }
                var startIndex = oldFilePath.indexOf(sysConnfig[env].upload_header_dir);
                var filePath = oldFilePath.substring(startIndex, oldFilePath.length);
                filePath = sysConnfig[env].thisDoman + filePath;
                AccountModel.findOne({_id: id}).exec(function (err, account) {
                    if (err) {
                        console.log("uploadHead error: errMsg:" + err);
                        log.error("uploadPic error: " + err);
                        res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                        return;
                    }
                    var oldHeadPortrait = account.head_portrait;
                    deleteHeader(oldHeadPortrait);
                    AccountModel.update({_id: id}, {$set: {head_portrait: filePath, update_time: new Date()}}).exec(function (err) {
                        if (err) {
                            console.log("uploadHead error: errMsg:" + err);
                            log.error("uploadPic error: " + err);
                            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                            return;
                        }
                        res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, filePath));
                    });
                });
            }
        });
    } else {
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
};

function deleteHeader(path) {
    if (!path){
        log.error('deleteHeader params error , path is empty or null');
        return;
    }
    var startIndex = path.lastIndexOf('/');
    var imageFileName = path.slice(startIndex + 1, path.length);
    log.info('=================imageFileName:' + imageFileName);
    if (imageFileName == 'initHead.jpg'){
        log.info('==============第一次更换头像');
        return;
    }
    var uploadHeadDir = sysConnfig[env].upload_root_dir + sysConnfig[env].upload_header_dir;
    var imageFilePath = uploadHeadDir + '/' + imageFileName;
    if (imageFilePath.indexOf('\\') > -1){
        imageFilePath = imageFilePath.replace(/\\/g, '/');
    }
    if(fs.existsSync(imageFilePath)) {
        fs.unlink(imageFilePath, function (err) {
            if (err){
                log.error('del header error, 删除图片错误' + err);
                return;
            }
            log.info('成功删除旧头像');
        });
    }
}



