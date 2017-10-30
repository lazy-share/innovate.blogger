/**
 * Created by lzy on 2017/9/3.
 *
 * <p>
 *     日记/心情服务层
 */
var mongoose = require('mongoose');
var NotesModel = mongoose.model('NotesModel');
var CommentModel = mongoose.model('CommentModel');
var ReplyModel = mongoose.model('ReplyModel');
var AccountModel = mongoose.model('AccountModel');
var result = require('../common/result');
var response = require('../common/response');
var log = require('log4js').getLogger('note');
var relationService = require('./relationship');
var RELATION = require('../common/relation_enum');


//我的、TA的日记
exports.notes = function (req, res) {
    var account_id = req.query.account_id;
    var current_account_id = req.query.current_account_id;
    var paging = req.query.paging;
    if (!account_id || !paging || !current_account_id) {
        log.error("notes params error; params:" + account_id + '|' + paging + '|' + current_account_id);
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    paging = JSON.parse(paging);
    var queryOpt = {account_id: account_id};
    if (paging.keyword) {
        queryOpt.content = new RegExp(paging.keyword, 'i');
    }
    NotesModel.find(queryOpt).sort({update_time: -1}).limit(paging.limit).skip(paging.skip).exec(function (err, docs) {
        if (err) {
            console.log('notes err! msg:' + err);
            log.error('notes err! msg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        NotesModel.find(queryOpt).count(function (err, count) {
            if (err) {
                console.log('notes err! msg:' + err);
                log.error('notes err! msg:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            AccountModel.findOne({_id: account_id}, {head_portrait: 1}).exec(function (err, doc) {
                if (err) {
                    log.error('新增日记后查询出错，error:' + err);
                    res.json(result.json(response.C606.status, response.C606.code, response.C606.msg, null));
                    return;
                }
                if (current_account_id != account_id) { //异步添加浏览次数
                    for (var i in docs){
                        docs[i].visitor = docs[i].visitor + 1;
                        (function (doc) {
                            NotesModel.update({account_id: account_id, _id: doc._id}, {$inc: {visitor: 1}}).exec(function (err) {
                                if (err) {
                                    console.log('notes err! msg:' + err);
                                    log.error('add ' + docs[i]._id + ' notes visitor err! msg:' + err);
                                }
                            });
                        })(docs[i])
                    }
                }
                var obj = {notes: docs, count: count, head_portrait: doc.head_portrait};
                res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, obj));
            });
        });

    });
};

function queryByPaging(res, account_id, paging, logMsg) {
    if (paging) {
        NotesModel.find({account_id: account_id}).sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, docs) {
            if (err) {
                log.error(logMsg + '查询出错，error:' + err);
                res.json(result.json(response.C606.status, response.C606.code, response.C606.msg, null));
                return;
            }
            NotesModel.find({account_id: account_id}).count().exec(function (err, count) {
                if (err) {
                    log.error(logMsg + '查询出错，error:' + err);
                    res.json(result.json(response.C606.status, response.C606.code, response.C606.msg, null));
                    return;
                }
                AccountModel.findOne({_id: account_id}, {head_portrait: 1}).exec(function (err, doc) {
                    if (err) {
                        log.error(logMsg + '查询出错，error:' + err);
                        res.json(result.json(response.C606.status, response.C606.code, response.C606.msg, null));
                        return;
                    }
                    var obj = {notes: docs, count: count, head_portrait: doc.head_portrait};
                    res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, obj));
                });
            });
        });
    } else { //不存在paging参数则不查
        res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, null));
    }
}

//新增日记/心情
exports.addNote = function (req, res) {
    var note = req.body.note;
    var paging = req.body.paging;
    if (!note){
        log.error("add note params error; note:" + note);
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    var nowTime = new Date();
    var comment = new CommentModel({
        replies: []
    });
    note.visitor = 0;
    note.praise = [];
    note.comment = comment;
    note.update_time = nowTime;
    note.create_time = nowTime;
    var newNote = new NotesModel(note);
    AccountModel.findOne({_id: newNote.account_id}).exec(function (err, acc) {
        if (err) {
            log.error('add note err! msg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        newNote.interspace_name = acc.interspace_name;
        newNote.head_portrait = acc.head_portrait;
        newNote.save(function (err) {
            if (err) {
                log.error('add note err! msg:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            queryByPaging(res, note.account_id, paging, '新增日记后');
        })
    });
};

//删除日记心情
exports.delNote = function (req, res) {
    var note = req.query.note;
    var paging = req.query.paging;
    if (!note){
        log.error("del note params error; note:" + note);
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    paging = JSON.parse(paging);
    note = JSON.parse(note);
    NotesModel.remove({account_id: note.account_id, _id: note.id}, function (err) {
        if (err) {
            log.error('del note err! msg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        relationService.deletePraiseAndCommentByDeleteDoc(note.id, RELATION.docType.NOTE);
        queryByPaging(res, note.account_id, paging, '删除日记后');
    })
};

//赞
exports.praise = function (req, res) {
    var account_id = req.body.account_id;
    var from = req.body.from;
    var id = req.body.id;
    var paging = req.body.paging;
    if (!account_id || !from ||!id){
        log.error('note praise error: params error :' + account_id + '|' + from + '|' + id);
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    NotesModel.findOne({account_id: account_id, _id: id}).exec(function (err, doc) {
        if (err) {
            log.error('note praise error:' + err);
            res.json(result.json(response.C606.status, response.C606.code, response.C606.msg, null));
            return;
        }
        var praise = doc.praise;
        var isExists = false;
        for (var i in praise){
            if (praise[i] == from){
                isExists = true;
                break;
            }
        }
        if (isExists) {
            if (doc.account_id != from) { //如果不是自己赞自己，则删除一条动态相关数据
                relationService.deletePraiseRelation(doc.account_id, from, doc._id, RELATION.docType.NOTE);
            }
            NotesModel.update({account_id: account_id, _id: id}, {$pull: {praise: from}}).exec(function (err) {
                if (err) {
                    log.error('note praise error:' + err);
                    res.json(result.json(response.C606.status, response.C606.code, response.C606.msg, null));
                    return;
                }
                if (paging) {
                    NotesModel.find({account_id: account_id}).sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, docs) {
                        if (err) {
                            log.error('删除赞后查询出错，error:' + err);
                            res.json(result.json(response.C606.status, response.C606.code, response.C606.msg, null));
                            return;
                        }
                        res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, docs));
                    });
                }else {
                    res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, null));
                }
            });
        }else {
            if (doc.account_id != from) { //如果不是自己赞自己，则添加一条动态相关数据
                relationService.addPraiseRelation(doc.account_id, from, doc._id, RELATION.docType.NOTE);
            }
            NotesModel.update({account_id: account_id, _id: id}, {$push: {praise: from}}).exec(function (err) {
                if (err) {
                    log.error('note praise error:' + err);
                    res.json(result.json(response.C606.status, response.C606.code, response.C606.msg, null));
                    return;
                }
                if (paging) {
                    NotesModel.find({account_id: account_id}).sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, docs) {
                        if (err) {
                            log.error('删除赞后查询出错，error:' + err);
                            res.json(result.json(response.C606.status, response.C606.code, response.C606.msg, null));
                            return;
                        }
                        res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, docs));
                    });
                }else {
                    res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, null));
                }
            });
        }
    });
};

//评论
exports.comment = function (req, res) {
    var reply = req.body.reply;
    if (!reply){
        log.error('note post comment error: params error :' + reply + '|' + JSON.stringify(reply));
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    NotesModel.findOne({account_id: reply.account_id, _id: reply.doc_id}).exec(function (err, doc) {
        if (err) {
            log.error('note post comment error:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        var nowTime = new Date();
        var newReply = new ReplyModel({
            create_time: nowTime,
            update_time: nowTime,
            content: reply.content,
            from_name: reply.from_name,
            subject_name: reply.subject_name,
            parent_id: reply.parent_id
        });
        if (doc.account_id != reply.from_name) {
            relationService.addCommentRelation(doc.account_id, reply.from_name, doc._id, RELATION.docType.NOTE);
        }
        if (!reply.parent_id) { //顶级评论发起者
            doc.comment.replies.push(newReply);
            updateComment(req, res, doc, reply.account_id, req.body.paging);
            return;
        }else {
            var allComment = doc.comment.replies;
            var newAllComent = recursionAppendChild(newReply, allComment, allComment);
            doc.comment.replies = newAllComent;
            doc.toObject();
            updateComment(req, res, doc, reply.account_id, req.body.paging);
        }
    });
};

//递归查找对应的父回复 currentReplies:顶级评论文档的replies属性
function recursionAppendChild(reply, rootReplies, currentReplies) {
    if (!currentReplies) {
        return rootReplies;
    }
    var isFind = false;
    for (var i = 0; i < currentReplies.length; i++){
        if (isFind) {
            break;
        }else {
            if (currentReplies[i]._id == reply.parent_id) {
                currentReplies[i].replies.push(reply);
                rootReplies.toObject();
                isFind = true;
                break;
            }else {
                recursionAppendChild(reply, rootReplies, currentReplies[i].replies);
            }
        }
    }
    return rootReplies;
}


function updateComment(req, res, doc, account_id, paging) {
    NotesModel.update({account_id: account_id, _id: doc._id},{$set: {comment: doc.comment}}, function (err) {
        if (err){
            log.error('note addComment error:' + err);
            res.json(result.json(response.C606.status, response.C606.code, response.C606.msg, null));
            return;
        }
        if (paging) {
            NotesModel.find({account_id: account_id}).sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, docs) {
                if (err) {
                    log.error('addComment后查询出错，error:' + err);
                    res.json(result.json(response.C606.status, response.C606.code, response.C606.msg, null));
                    return;
                }
                res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, docs));
            });
        }else {
            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, null));
        }
    });
}

//删除评论
exports.delComment = function (req, res) {
    var reply = req.query.reply;
    reply = JSON.parse(reply);
    if (!reply){
        log.error('note delComment error: params error :' + reply + '|' + JSON.stringify(reply));
        res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
        return;
    }
    NotesModel.findOne({account_id: reply.account_id, _id: reply.doc_id}).exec(function (err, doc) {
        if (err) {
            log.error('delComment error:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        if (!doc) {
            log.error('delComment error: note not found');
            res.json(result.json(response.C607.status, response.C607.code, response.C607.msg, null));
            return;
        }
        var allComment = doc.comment.replies;
        var newAllComment = recursionSpliceChild(allComment, allComment, reply);
        doc.comment.replies = newAllComment;
        updateComment(req, res, doc, reply.account_id, JSON.parse(req.query.paging));
    });
};

//删除一个评论、回复
function recursionSpliceChild(rootReply, currentReply, reply) {
    if (!currentReply) {
        return rootReply;
    }
    var isFindDelete = false;
    for (var i = 0; i < currentReply.length; i++){
        if (isFindDelete) {
            break;
        }else {
            if (currentReply[i]._id == reply.id) {
                (function (obj, reply) {
                    if (obj.from_name != reply.account_id){
                        relationService.deleteCommentRelation(reply.account_id, obj.from_name, reply.doc_id, RELATION.docType.NOTE);
                    }
                })(currentReply[i], reply);
                currentReply.splice(i, 1);
                isFindDelete = true;
                break;
            }else {
                recursionSpliceChild(rootReply, currentReply[i].replies, reply);
            }
        }
    }
    return rootReply;
}




