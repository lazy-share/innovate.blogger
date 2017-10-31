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
    RelationshipModel.find({'from._id': account_id, type: RELATION.type.ATTENTION}).sort({'update_time': -1}).exec(function (err, attentions) {
        if (err) {
            console.log('account info attentions err! msg:' + err);
            log.error('account info attentions err! msg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        if (attentions && attentions.length > 0){
            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, attentions));
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
    RelationshipModel.find({'subject._id': account_id, type: RELATION.type.ATTENTION}).sort({'update_time': -1}).exec(function (err, fans) {
        if (err) {
            console.log('account info fans err! msg:' + err);
            log.error('account info fans err! msg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        if (fans && fans.length > 0){
            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, fans));
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

    RelationshipModel.findOne({type: RELATION.type.ATTENTION, 'from._id': from, 'subject._id': subject}, function (err, doc) {
            if (err) {
                log.error('account info post attention error! msg:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            if (doc) {  //已经关注过
                doc.set('update_time', Date.now()); //更新时间
                doc.set('is_view', false);
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
                var accIds = [];
                accIds.push(from);
                accIds.push(subject);
                AccountModel.find({_id: {$in: accIds}}).exec(function (err, accs) {
                    if (err) {
                        log.error('account info post attention error! msg:' + err);
                        res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                        return;
                    }

                    var relationshipModel = {};
                    if (accIds[0] == String(accs[0]._id)){
                        relationshipModel = new RelationshipModel({
                            subject: accs[1],
                            from: accs[0],
                            create_time:nowTime,
                            update_time:nowTime,
                            type: RELATION.type.ATTENTION
                        });
                    }else {
                        relationshipModel = new RelationshipModel({
                            subject: accs[0],
                            from: accs[1],
                            create_time:nowTime,
                            update_time:nowTime,
                            type: RELATION.type.ATTENTION
                        });
                    }
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

    RelationshipModel.findOne({type: RELATION.type.ATTENTION, 'from._id': from, 'subject._id': subject}, function (err, doc) {
        if (err) {
            log.error('account info delte attention error! msg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        if (!doc){
            log.error('account info delte attention error! msg:无此关注数据');
            res.json(result.json(response.C605.status, response.C605.code, response.C605.msg, null));
            return;
        }
        doc.remove(function (err) {
            if (err) {
                log.error('account info delete attention error! msg:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            req.query.account_id = subject;
            fans(req, res);
        });
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
    RelationshipModel.find({type: RELATION.type.VISITOR, 'subject._id': subject}).sort({update_time: -1}).exec(function (err, visitors) {
       if (err){
           log.error('account info visitors error! msg:' + err);
           res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
           return;
       }
        if (visitors && visitors.length > 0){
            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, visitors));
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
    RelationshipModel.findOne({'subject._id': subject, 'from._id': from, type: RELATION.type.VISITOR}).exec(function (err, doc) {
        if (err) {
            log.error('addVisitor error! msg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        if (doc){ //访问过
            doc.update_time = new Date();
            doc.ip = getClientIp(req);
            doc.is_view = false;
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
            var accIds = [];
            accIds.push(from);
            accIds.push(subject);
            AccountModel.find({_id: {$in: accIds}}).exec(function (err, accs) {
                if (err) {
                    log.error('account info post visitor error! msg:' + err);
                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                    return;
                }

                var relationshipModel = {};
                if (accIds[0] == String(accs[0]._id)){
                    relationshipModel = new RelationshipModel({
                        subject: accs[1],
                        from: accs[0],
                        create_time:nowTime,
                        update_time:nowTime,
                        ip:ip,
                        type: RELATION.type.VISITOR
                    });
                }else {
                    relationshipModel = new RelationshipModel({
                        subject: accs[0],
                        from: accs[1],
                        create_time:nowTime,
                        update_time:nowTime,
                        ip:ip,
                        type: RELATION.type.VISITOR
                    });
                }
                relationshipModel.save(function (err) {
                    if (err) {
                        log.error('addVisitor error! msg:' + err);
                        res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                        return;
                    } else {
                        res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, null));
                    }
                });
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

