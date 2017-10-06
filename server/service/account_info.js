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
        var form = new multiparty.Form({uploadDir: process.cwd() + '/server/public/web/images/header'});
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
                var startIndex = inputFile.path.indexOf('\\public\\web\\images\\header');
                var filePath = inputFile.path.substring(startIndex, inputFile.path.length).replace(/\\/g, '/');
                filePath = sysConnfig[env].thisDoman + filePath;
                AccountInfoModel.update({username: username}, {$set: {head_portrait: filePath}})
                    .exec(function (err) {
                        if (err) {
                            console.log("uploadHead error: errMsg:" + err);
                            log.error("uploadPic error: " + err);
                            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                            return;
                        }
                        res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, filePath));
                    });
            }
        });
    } else {
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
};

//我的关注
exports.attentions = function (req, res) {
    var username = req.query.username;
    if (!username) {
        log.error("account info attentions username: " + username);
    }

    //我的关注
    // RelationshipModel.find({from: username, type: 1}).distinct("subject").exec(function (err, attentions) {
    RelationshipModel.find({from: username, type: 1}).exec(function (err, attentions) {
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
    if (!username) {
        log.error("account info fans username: " + username);
    }

    //关注我的
    // RelationshipModel.distinct("from", {subject: username, type: 1}).exec(function (err, fans) {
    RelationshipModel.find({subject: username, type: 1}).exec(function (err, fans) {
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
                var relationshipModel = new RelationshipModel({
                    subject: subject,
                    from: from,
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
