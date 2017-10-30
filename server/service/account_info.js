/**
 * Created by lzy on 2017/9/3.
 *
 * <p>
 *     账号信息服务层
 */
var mongoose = require('mongoose');
var AccountInfoModel = mongoose.model('AccountInfoModel');
var AccountModel = mongoose.model('AccountModel');
var RelationshipModel = mongoose.model('RelationshipModel');
var result = require('../common/result');
var response = require('../common/response');
var log = require('log4js').getLogger('account');
var sysConnfig = require('../conf/sys_config');
var env = require("../conf/environments");
var fs = require("fs");
var RELATION = require('../common/relation_enum');

//基本信息
exports.details = function (req, res) {
    var account_id = req.query.account_id;
    log.info("=====================enter account info details================");
    log.info("account_id:" + account_id);
    if (account_id) {
        AccountInfoModel.findOne({account_id: account_id}, function (err, doc) {
            if (err) {
                log.error('account info details err! msg:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            AccountModel.findOne({_id: account_id}).exec(function (err, account) {
                if (err) {
                    log.error('account info details err! msg:' + err);
                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                    return;
                }
                doc.head_portrait = account.head_portrait;
                doc.interspace_name = account.interspace_name;
                log.debug("=============account_id " + account_id + " info is " + JSON.stringify(doc));
                res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, doc));
            });
        });
    }
};

//编辑基本信息
exports.update = function (req, res) {
    var accountInfo = JSON.parse(req.body.params.updates[0].value);
    accountInfo.update_time = new Date();
    log.info("============enter account info update accountInfo:" + JSON.stringify(accountInfo));
    var account_id = accountInfo.account_id;

    if (!account_id) {
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }

    AccountModel.findOne({_id: account_id}).exec(function (err, account) {
        if (err) {
            console.log('update account info error, msg: ' + err);
            log.error('update account info err! msg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        account.interspace_name = accountInfo.interspace_name;
        account.save(function (err) {
            if (err) {
                console.log('update account info error, msg: ' + err);
                log.error('update account info err! msg:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            AccountInfoModel.update({account_id: account_id}, {$set: accountInfo}).exec(function (err) {
                if (err) {
                    console.log('update account info error, msg: ' + err);
                    log.error('update account info err! msg:' + err);
                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                    return;
                }
                res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, null));});
        });
    });

};

//我的关注
exports.attentions = function (req, res) {
    var account_id = req.query.account_id;
    log.info("============enter attentions account_id:" + account_id);
    if (!account_id) {
        log.error("account info attentions account_id: " + account_id);
        return;
    }

    //我的关注
    RelationshipModel.find({from: account_id, type: RELATION.type.ATTENTION}).sort({'update_time': -1}).exec(function (err, attentions) {
        if (err) {
            console.log('account info attentions err! msg:' + err);
            log.error('account info attentions err! msg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        if (attentions && attentions.length > 0){
            var accountIds = [];
            for (var i in attentions){
                accountIds.push(attentions[i].subject);
            }
            AccountModel.find({account_id: {$in: accountIds}}).exec(function (err, docs) {
                if (err) {
                    console.log('account info attentions err! msg:' + err);
                    log.error('account info attentions err! msg:' + err);
                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                    return;
                }
                res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, docs));
            });
        }else {
            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, []));
        }
    });
};

//关注我的
exports.fans = function (req, res) {
   fans(req, res);
};

function fans(req, res) {
    var account_id = req.query.account_id;
    log.info("============enter fans account_id:" + account_id);
    if (!account_id) {
        log.error("account info fans account_id: " + account_id);
    }

    //关注我的
    RelationshipModel.find({subject: account_id, type: RELATION.type.ATTENTION}).sort({'update_time': -1}).exec(function (err, fans) {
        if (err) {
            console.log('account info fans err! msg:' + err);
            log.error('account info fans err! msg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        if (fans && fans.length > 0){
            var accountIds = [];
            for (var i in fans){
                accountIds.push(fans[i].from);
            }
            AccountModel.find({account_id: {$in: accountIds}}).exec(function(err, docs){
                if (err) {
                    console.log('account info fans err! msg:' + err);
                    log.error('account info fans err! msg:' + err);
                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                    return;
                }
                res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, docs));
            });
        }else {
            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, []));
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

    RelationshipModel.findOne({type: RELATION.type.ATTENTION, from: from, subject: subject}, function (err, doc) {
            if (err) {
                log.error('account info post attention error! msg:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            if (doc) {  //已经关注过
                doc.set('update_time', Date.now()); //更新时间
                doc.save(function (err) {
                    if (err) {
                        log.error('account info post attention error! msg:' + err);
                        res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                        return;
                    } else {
                        req.query.account_id = subject;
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
                    type: RELATION.type.ATTENTION
                });
                relationshipModel.save(function (err) {
                    if (err) {
                        log.error('account info post attention error! msg:' + err);
                        res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                        return;
                    } else {
                        req.query.account_id = subject;
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

    RelationshipModel.find({type: RELATION.type.ATTENTION, from: from, subject: subject}, function (err, docs) {
        if (err) {
            log.error('account info delte attention error! msg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        if (docs && docs.length > 0) {
            RelationshipModel.remove({type: RELATION.type.ATTENTION, subject: subject, from: from},function (err) {
                if (err) {
                    log.error('account info delete attention error! msg:' + err);
                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                    return;
                }
                req.query.account_id = subject;
                fans(req, res);
            });
        }
    })
};

//我 TA 的访客
exports.visitors = function (req, res) {
    var subject = req.query.account_id;
    log.info("===========enter visitors subject:" + subject);
    if (!subject) {
        log.error('account info visitors error: params subject is empty or null');
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    RelationshipModel.find({type: RELATION.type.VISITOR, subject: subject}).sort({update_time: -1}).exec(function (err, visitors) {
       if (err){
           log.error('account info visitors error! msg:' + err);
           res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
           return;
       }
        if (visitors && visitors.length > 0){
            var accountIds = [];
            for (var i in visitors){
                accountIds.push(visitors[i].from);
            }
            var query = AccountModel.find({account_id: {$in: accountIds}});
            query.exec(function (err, docs) {
                if (err) {
                    log.error('account info visitors error! msg:' + err);
                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                    return;
                }
                res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, docs));
            });
        }else {
            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, []));
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
    RelationshipModel.findOne({subject: subject, from: from, type: RELATION.type.VISITOR}).exec(function (err, doc) {
        if (err) {
            log.error('addVisitor error! msg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        if (doc){ //访问过
            doc.update_time = new Date();
            doc.ip = getClientIp(req);
            doc.save(function (err) {
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
                type: RELATION.type.VISITOR
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

