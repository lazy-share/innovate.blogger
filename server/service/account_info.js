/**
 * Created by lzy on 2017/9/3.
 *
 * <p>
 *     账号信息服务层
 */
var mongoose = require('mongoose');
var AccountInfoModel = mongoose.model('AccountInfoModel');
var RelationshipModel = mongoose.model('RelationshipModel');
var result = require('../common/result');
var response = require('../common/response');
var log = require('log4js').getLogger('account');
var sysConnfig = require('../conf/sys_config');
var env = require("../conf/environments");
var fs = require("fs");

//基本信息
exports.details = function (req, res) {
    var username = req.query.username;
    log.info("=====================enter account info details================");
    log.info("username:" + username);
    if (username) {
        AccountInfoModel.findOne({username: username}, function (err, doc) {
            if (err) {
                console.log('account info details err! msg:' + err);
                log.error('account info details err! msg:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }

            log.debug("=============account " + username + " info is " + JSON.stringify(doc));
            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, doc));
        });
    }
};

//编辑基本信息
exports.update = function (req, res) {
    var accountInfo = JSON.parse(req.body.params.updates[0].value);
    accountInfo.update_time = new Date();
    log.info("============enter account info update accountInfo:" + JSON.stringify(accountInfo));
    var username = accountInfo.username;

    if (!username) {
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }

    AccountInfoModel.update({username: username}, {$set: accountInfo}).exec(function (err) {
        if (err) {
            console.log('update account info error, msg: ' + err);
            log.error('update account info err! msg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, null));
    });

};

//上传头像
exports.uploadHead = function (req, res) {
    var username = req.params.username;
    log.info("====================enter uploadHead, params: " + username);
    if (username) {
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
                log.info(username + " 成功上传图片：" + inputFile.path);
                var oldFilePath = inputFile.path;
                if (oldFilePath.indexOf('\\') > -1) {
                    oldFilePath = oldFilePath.replace(/\\/g, '/');
                }
                var startIndex = oldFilePath.indexOf(sysConnfig[env].upload_header_dir);
                var filePath = oldFilePath.substring(startIndex, oldFilePath.length);
                filePath = sysConnfig[env].thisDoman + filePath;
                AccountInfoModel.findOne({username: username}).exec(function (err, info) {
                    if (err) {
                        console.log("uploadHead error: errMsg:" + err);
                        log.error("uploadPic error: " + err);
                        res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                        return;
                    }
                    var oldHeadPortrait = info.head_portrait;
                    deleteHeader(oldHeadPortrait);
                    AccountInfoModel.update({username: username}, {$set: {head_portrait: filePath, update_time: new Date()}}).exec(function (err) {
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
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            log.info('成功删除旧头像');
        });
    }
}

//我的关注
exports.attentions = function (req, res) {
    var username = req.query.username;
    log.info("============enter attentions username:" + username);
    if (!username) {
        log.error("account info attentions username: " + username);
    }

    //我的关注
    // RelationshipModel.find({from: username, type: 1}).distinct("subject").exec(function (err, attentions) {
    RelationshipModel.find({from: username, type: 1}).sort({'update_time': -1, 'subject': 1}).exec(function (err, attentions) {
        if (err) {
            console.log('account info attentions err! msg:' + err);
            log.error('account info attentions err! msg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        var obj = {attentions: [], headPortraits: [] };
        obj.attentions = attentions;
        if (attentions && attentions.length > 0){
            var usernameArr = [];
            for (var i in attentions){
                usernameArr.push(attentions[i].subject);
            }
            AccountInfoModel.find({username: {$in: usernameArr}}, {username: 1, head_portrait: 1}).exec(function (err, docs) {
                if (err) {
                    console.log('account info attentions err! msg:' + err);
                    log.error('account info attentions err! msg:' + err);
                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                    return;
                }
                obj.headPortraits = docs;
                res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, obj));
            });
        }else {
            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, obj));
        }
    });
};

//关注我的
exports.fans = function (req, res) {
   fans(req, res);
};

function fans(req, res) {
    var username = req.query.username;
    log.info("============enter fans username:" + username);
    if (!username) {
        log.error("account info fans username: " + username);
    }

    //关注我的
    // RelationshipModel.distinct("from", {subject: username, type: 1}).exec(function (err, fans) {
    RelationshipModel.find({subject: username, type: 1}).sort({'update_time': -1, 'from': 1}).exec(function (err, fans) {
        if (err) {
            console.log('account info fans err! msg:' + err);
            log.error('account info fans err! msg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        var obj = {fans: [], headPortraits: [] };
        obj.fans = fans;
        if (fans && fans.length > 0){
            var usernameArr = [];
            for (var i in fans){
                usernameArr.push(fans[i].from);
            }
            AccountInfoModel.find({username: {$in: usernameArr}}, {username: 1, head_portrait: 1}).exec(function(err, docs){
                if (err) {
                    console.log('account info fans err! msg:' + err);
                    log.error('account info fans err! msg:' + err);
                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                    return;
                }
                obj.headPortraits = docs;
                res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, obj));
            });
        }else {
            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, obj));
        }
    });
}

//关注他
exports.attention = function (req, res) {
    var subject = req.body.subject; //关注主题
    var from = req.body.from; //关注者
    log.info("============enter attention subject:" + subject + "from:" + from);
    if (!subject || !from) {
        log.info("account info post attention subject: " + subject + 'from ' + from);
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }

    RelationshipModel.find({type: 1, from: from, subject: subject}, function (err, docs) {
            if (err) {
                log.error('account info post attention error! msg:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            if (docs && docs.length > 0) {  //已经关注过
                docs[0].set('update_time', Date.now()); //更新时间
                docs[0].save(function (err) {
                    if (err) {
                        log.error('account info post attention error! msg:' + err);
                        res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                        return;
                    } else {
                        req.query.username = subject;
                        fans(req, res);
                    }
                });
            } else {  //没有关注过则添加关注
                var nowTime = new Date();
                var relationshipModel = new RelationshipModel({
                    subject: subject,
                    from: from,
                    create_time:nowTime,
                    update_time:nowTime,
                    type: 1
                });
                relationshipModel.save(function (err) {
                    if (err) {
                        log.error('account info post attention error! msg:' + err);
                        res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                        return;
                    } else {
                        req.query.username = subject;
                        fans(req, res);
                    }
                });
            }
        }
    );
};

//取消关注
exports.cancleAttention = function (req, res) {
    var subject = req.query.subject; //取消关注主题
    var from = req.query.from; //取消者
    log.info("============enter cancleAttention subject:" + subject + "from:" + from);
    if (!subject || !from) {
        log.info("account info delete attention subject: " + subject + 'from ' + from);
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }

    RelationshipModel.find({type: 1, from: from, subject: subject}, function (err, docs) {
        if (err) {
            log.error('account info delte attention error! msg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        if (docs && docs.length > 0) {
            RelationshipModel.remove({type: 1, subject: subject, from: from},function (err) {
                if (err) {
                    log.error('account info delete attention error! msg:' + err);
                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                    return;
                }
                req.query.username = subject;
                fans(req, res);
            });
        }
    })
};

//我 TA 的访客
exports.visitors = function (req, res) {
    var subject = req.query.username;
    log.info("===========enter visitors subject:" + subject);
    if (!subject) {
        log.error('account info visitors error: params subject is empty or null');
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    RelationshipModel.find({type: 2, subject: subject}).sort({update_time: -1}).exec(function (err, visitors) {
       if (err){
           log.error('account info visitors error! msg:' + err);
           res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
           return;
       }
        var obj = {visitors: [], headPortraits: [] };
        obj.visitors = visitors;
        if (visitors && visitors.length > 0){
            var usernameArr = [];
            for (var i in visitors){
                usernameArr.push(visitors[i].from);
            }
            var query = AccountInfoModel.find({username: {$in: usernameArr}}, {username: 1, head_portrait:1});
            query.exec(function (err, docs) {
                if (err) {
                    log.error('account info visitors error! msg:' + err);
                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                    return;
                }
                obj.headPortraits = docs;
                res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, obj));
            });
        }else {
            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, obj));
        }
    });
};

//添加访客
exports.addVisitor = function (req, res) {
    var subject = req.body.subject;
    var from = req.body.from;
    log.info("============enter addVisitor subject:" + subject + "from:" + from);
    if (!subject || !from) {
        log.error("addVisitor error: params subject or from is empty or null");
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    RelationshipModel.find({subject: subject, from: from, type: 2}).exec(function (err, docs) {
        if (err) {
            log.error('addVisitor error! msg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        if (docs && docs.length > 0){ //访问过
            docs[0].update_time = new Date();
            docs[0].ip = getClientIp(req);
            docs[0].save(function (err) {
                if (err){
                    log.error('addVisitor error! msg:' + err);
                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                    return;
                }
                res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, null));
            });
        }else {
            var nowTime = new Date();
            var ip = getClientIp(req);
            var relationshipModel = new RelationshipModel({
                subject: subject,
                from: from,
                create_time:nowTime,
                update_time:nowTime,
                ip:ip,
                type: 2
            });
            relationshipModel.save(function (err) {
                if (err) {
                    log.error('addVisitor error! msg:' + err);
                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                    return;
                } else {
                    res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, null));
                }
            });
        }
    });
};

function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};

//todo 待完善
exports.deleteOne = function (username) {
    if (!username) {
        // res.json({code: false, msg: '参数username不能为空'});
        console.log('参数username不能为空');
        return false;
    }
    AccountInfoModel.findOne({username: username}, function (err, doc) {
        if (err) {
            console.log('delete account info error, msg: ' + err);
            // res.json({code: false, msg: '系统错误！'});
            throw new Error(err);
        }
        if (doc) {
            doc.remove(function (err) {
                if (err) {
                    console.log('delete account info error, msg: ' + err);
                    // res.json({code: false, msg: '系统错误！'});
                    throw new Error(err);
                }
                return true;
                // res.json({code: true, msg: '删除成功!'});
            });
        } else {
            // res.json({code: false, msg: '没有该用户'});
            console.log('========>  查无数据!');
            return false;
        }
    });
};
