/**
 * Created by lzy on 2017/11/4.
 */
var mongoose = require('mongoose');
var UpdateInterspaceNameLogModel = mongoose.model('UpdateInterspaceNameLogModel');
var ArticlesModel = mongoose.model('ArticlesModel');
var CommentModel = mongoose.model('CommentModel');
var ImageModel = mongoose.model('ImageModel');
var NotesModel = mongoose.model('NotesModel');
var RelationshipModel = mongoose.model('RelationshipModel');
const log = require('log4js').getLogger("update_interspace_name");
var mongoose = require('mongoose');

module.exports = function () {
    //setInterval(controller, 1000 * 60 * 30); //30分钟执行一次
    setInterval(start, 1000 * 60 * 0.3); //30分钟执行一次
};

function controller() {
    var nowTime = new Date();
    if (nowTime.getHours() == 2 && nowTime.getMinutes() <= 30){
        start();
    }
}

function start() {
    UpdateInterspaceNameLogModel.find({is_opt: false}).exec(function (err, logs) {
        if (err) {
            log.error('start error:' + err);
            return;
        }
        updateRelation(logs);
        setTimeout(function () {
            updateArticlePraise(logs);
        }, 10000);
        setTimeout(function () {
            updateComment(logs);
        }, 10000);
        setTimeout(function () {
            updateImageComment(logs);
        }, 10000);
        setTimeout(function () {
            updateImagePraise(logs);
        }, 10000);
        setTimeout(function () {
            updateNoteComment(logs);
        }, 10000);
        setTimeout(function () {
            updateNotePraise(logs);
        }, 10000);
    });
}

function updateRelation(logs) {
    for (var i in logs) {
        (function (obj) {
            var accountId = String(obj.account_id);
            accountId = mongoose.Types.ObjectId(accountId);
            RelationshipModel.find({$or: [{'from._id': accountId,'subject._id': accountId}]}).exec(function (err, docs) {
                if (err) {
                    log.error('updateRelation error: ' + err);
                    return;
                }
                if (!docs || docs.length < 1){
                    log.info('updateRelation relation id' + accountId + '查无数据');
                    return;
                }
                for (var i in docs){
                    if (docs[i].subject._id == obj.account_id){
                        docs[i].subject.inter_space_name = obj.new_interspace_name;
                    }else if (docs[i].from._id == obj.account_id){
                        docs[i].from.inter_space_name = obj.new_interspace_name;
                    }else {
                        log.error('updateRelation RelationshipModel.find error');
                        continue;
                    }
                    (function (doc) {
                        doc.save(function (err) {
                            if (err){
                                log.error('updateRelation RelationshipModel.upate error');
                            }
                        });
                    })(docs[i])
                }

            });
        })(logs[i])
    }
}

function updateArticlePraise(logs) {
    ArticlesModel.find().exec(function (err, docs) {
        if (!docs || docs.length < 1){
            log.info('updateArticlePraise查无数据');
            return;
        }
        for (var j in docs){
            (function (doc) {
                if (doc.praise.length > 0){
                    for (var e in logs){
                        (function (obj, doc) {
                            for (var k in doc.praise){
                                if (doc.praise[k]._id == obj.account_id){
                                    doc.praise[k].inter_space_name = obj.new_interspace_name;
                                    doc.save(function (err) {
                                        if (err){
                                            log.error('updateArticlePraise err' + err);
                                        }
                                    })
                                    break;
                                }
                            }
                        })(logs[e], doc)
                    }
                }
            })(docs[j])
        }
    });
}

function updateImagePraise(logs) {
    ImageModel.find().exec(function (err, docs) {
        if (!docs || docs.length < 1){
            log.info('updateImagePraise查无数据');
            return;
        }
        for (var j in docs){
            (function (doc) {
                if (doc.praise.length > 0){
                    for (var e in logs){
                        (function (obj, doc) {
                            for (var k in doc.praise){
                                if (doc.praise[k]._id == obj.account_id){
                                    doc.praise[k].inter_space_name = obj.new_interspace_name;
                                    doc.save(function (err) {
                                        if (err){
                                            log.error('updateImagePraise err' + err);
                                        }
                                    })
                                    break;
                                }
                            }
                        })(logs[e], doc)
                    }
                }
            })(docs[j])
        }
    });
}

function updateNotePraise(logs) {
    NotesModel.find().exec(function (err, docs) {
        if (!docs || docs.length < 1){
            log.info('updateNotePraise查无数据');
            return;
        }
        for (var j in docs){
            (function (doc) {
                if (doc.praise.length > 0){
                    for (var e in logs){
                        (function (obj, doc) {
                            for (var k in doc.praise){
                                if (doc.praise[k]._id == obj.account_id){
                                    doc.praise[k].inter_space_name = obj.new_interspace_name;
                                    break;
                                }
                            }
                            doc.toObject();
                            doc.save(function (err) {
                                if (err){
                                    log.error('updateNotePraise error: ' + err);
                                }
                            });
                        })(logs[e], doc)
                    }
                }
            })(docs[j])
        }
    });
}

function updateImageComment(logs) {
    ImageModel.find().exec(function (err, docs) {
        if (err){
            log.error('updateImageComment error:' + err);
            return;
        }
        if (!docs || docs.length < 1){
            log.info('updateImageComment查无数据');
            return;
        }
        for (var i in docs){
            (function (doc) {
                var replies = doc.comment.replies;
                for (var j in logs){
                    var recursionUpdateReplyInterspaceName = function (replies, log) {
                        if (replies && replies.length > 0){
                            for (var i in replies){
                                if (replies[i]._id == log.account_id){
                                    replies[i].inter_space_name = log.new_interspace_name;
                                }
                                return recursionUpdateReplyInterspaceName(replies[i].replies, log);
                            }
                        }
                        return;
                    }
                    recursionUpdateReplyInterspaceName(replies, logs[j]);
                }
                doc.save(function (err) {
                    if (err){
                        log.error('updateImageComment error:' + err);
                    }
                });
            })(docs[i])
        }
    });
}

function updateNoteComment(logs) {
    NotesModel.find().exec(function (err, docs) {
        if (err){
            log.error('updateNoteComment error:' + err);
            return;
        }
        if (!docs || docs.length < 1){
            log.info('updateNoteComment查无数据');
            return;
        }
        for (var i in docs){
            (function (doc) {
                var replies = doc.comment.replies;
                for (var j in logs){
                    var recursionUpdateReplyInterspaceName = function (replies, log) {
                        if (replies && replies.length > 0){
                            for (var i in replies){
                                if (replies[i]._id == log.account_id){
                                    replies[i].inter_space_name = log.new_interspace_name;
                                }
                                return recursionUpdateReplyInterspaceName(replies[i].replies, log);
                            }
                        }
                        return;
                    }
                    recursionUpdateReplyInterspaceName(replies, logs[j]);
                }
                doc.save(function (err) {
                    if (err){
                        log.error('updateNoteComment error:' + err);
                    }
                });
            })(docs[i])
        }
    });
}

function updateComment(logs) {
    CommentModel.find().exec(function (err, docs) {
        if (err){
            log.error('updateComment error:' + err);
            return;
        }
        if (!docs || docs.length < 1){
            log.info('updateComment查无数据');
            return;
        }
        for (var i in docs){
            (function (doc) {
                var replies = doc.replies;
                for (var j in logs){
                    var recursionUpdateReplyInterspaceName = function (replies, log) {
                        if (replies && replies.length > 0){
                            for (var i in replies){
                                if (replies[i]._id == log.account_id){
                                    replies[i].inter_space_name = log.new_interspace_name;
                                }
                                return recursionUpdateReplyInterspaceName(replies[i].replies, log);
                            }
                        }
                        return;
                    }
                    recursionUpdateReplyInterspaceName(replies, logs[j]);
                }
                doc.save(function (err) {
                    if (err){
                        log.error('updateComment error:' + err);
                    }
                });
            })(docs[i])
        }
    });
}
