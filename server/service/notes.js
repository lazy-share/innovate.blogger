/**
 * Created by lzy on 2017/9/3.
 *
 * <p>
 *     日记/心情服务层
 */
var mongoose = require('mongoose');
require('../models/notes');
var NotesModel = mongoose.model('NotesModel');
var CommentModel = mongoose.model('CommentModel');
var ReplyModel = mongoose.model('ReplyModel');
var AccountInfoModel = mongoose.model('AccountInfoModel');
var result = require('../common/result');
var response = require('../common/response');
var log = require('log4js').getLogger('note');


//我的、TA的日记
exports.notes = function (req, res) {
    var username = req.query.username;
    var currentUsername = req.query.currentUsername;
    var paging = req.query.paging;
    if (!username || !paging || !currentUsername) {
        log.error("notes params error; params:" + username + '|' + paging + '|' + currentUsername);
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    paging = JSON.parse(paging);
    var query = NotesModel.find({username: username});
    if (paging.keyword) {
        query.where('content',paging.keyword);
    }
    query.sort({update_time: -1}).limit(paging.limit).skip(paging.skip);
    query.exec(function (err, docs) {
        if (err) {
            console.log('notes err! msg:' + err);
            log.error('notes err! msg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        NotesModel.find({username: username}).count(function (err, count) {
            if (err) {
                console.log('notes err! msg:' + err);
                log.error('notes err! msg:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            AccountInfoModel.findOne({username: username}, {head_portrait: 1}).exec(function (err, doc) {
                if (err) {
                    log.error('新增日记后查询出错，error:' + err);
                    res.json(result.json(response.C606.status, response.C606.code, response.C606.msg, null));
                    return;
                }
                if (currentUsername != username) { //异步添加浏览次数
                    for (var i in docs){
                        docs[i].visitor = docs[i].visitor + 1;
                        NotesModel.update({username: username, _id: docs[i]._id}, {$inc: {visitor: 1}}).exec(function (err) {
                            if (err) {
                                console.log('notes err! msg:' + err);
                                log.error('add ' + docs[i]._id + ' notes visitor err! msg:' + err);
                            }
                        });
                    }
                }
                var obj = {notes: docs, count: count, head_portrait: doc.head_portrait};
                res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, obj));
            });
        });

    });
};

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
    newNote.save(function (err) {
        if (err) {
            log.error('add note err! msg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        if (paging) {
            NotesModel.find({username: note.username}).sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, docs) {
                if (err) {
                    log.error('新增日记后查询出错，error:' + err);
                    res.json(result.json(response.C606.status, response.C606.code, response.C606.msg, null));
                    return;
                }
                NotesModel.find({username: note.username}).count().exec(function (err, count) {
                    if (err) {
                        log.error('新增日记后查询出错，error:' + err);
                        res.json(result.json(response.C606.status, response.C606.code, response.C606.msg, null));
                        return;
                    }
                    AccountInfoModel.findOne({username: note.username}, {head_portrait: 1}).exec(function (err, doc) {
                        if (err) {
                            log.error('新增日记后查询出错，error:' + err);
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
    })
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
    NotesModel.remove({username: note.username, _id: note.id}, function (err) {
        if (err) {
            log.error('del note err! msg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        if (paging) {
            NotesModel.find({username: note.username}).sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, docs) {
                if (err) {
                    log.error('删除日记后查询出错，error:' + err);
                    res.json(result.json(response.C606.status, response.C606.code, response.C606.msg, null));
                    return;
                }
                NotesModel.find({username: note.username}).count().exec(function (err, count) {
                    if (err) {
                        log.error('删除日记后查询出错，error:' + err);
                        res.json(result.json(response.C606.status, response.C606.code, response.C606.msg, null));
                        return;
                    }
                    AccountInfoModel.findOne({username: note.username}, {head_portrait: 1}).exec(function (err, doc) {
                        if (err) {
                            log.error('删除日记后查询出错，error:' + err);
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
    })
};

//赞
exports.praise = function (req, res) {
    var username = req.body.username;
    var from = req.body.from;
    var id = req.body.id;
    var paging = req.body.paging;
    if (!username || !from ||!id){
        log.error('note praise error: params error :' + username + '|' + from + '|' + id);
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    NotesModel.findOne({username: username, _id: id}).exec(function (err, doc) {
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
            NotesModel.update({username: username, _id: id}, {$pull: {praise: from}}).exec(function (err) {
                if (err) {
                    log.error('note praise error:' + err);
                    res.json(result.json(response.C606.status, response.C606.code, response.C606.msg, null));
                    return;
                }
                if (paging) {
                    NotesModel.find({username: username}).sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, docs) {
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
            NotesModel.update({username: username, _id: id}, {$push: {praise: from}}).exec(function (err) {
                if (err) {
                    log.error('note praise error:' + err);
                    res.json(result.json(response.C606.status, response.C606.code, response.C606.msg, null));
                    return;
                }
                if (paging) {
                    NotesModel.find({username: username}).sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, docs) {
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
    NotesModel.findOne({username: reply.username, _id: reply.doc_id}).exec(function (err, doc) {
        if (err) {
            log.error('note post comment error:' + err);
            res.json(result.json(response.C606.status, response.C606.code, response.C606.msg, null));
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
        if (!reply.parent_id) { //顶级评论发起者
            doc.comment.replies.push(newReply);
            updateComment(req, res, doc, reply.username, req.body.paging);
            return;
        }else {
            var allComment = doc.comment.replies;
            var newAllComent = recursionAppendChild(newReply, allComment, allComment);
            doc.comment.replies = newAllComent;
            doc.toObject();
            updateComment(req, res, doc, reply.username, req.body.paging);
        }
    });
};

//递归查找对应的父回复 currentReplies:顶级评论文档的replies属性
var isFind = false;
function recursionAppendChild(reply, rootReplies, currentReplies) {
    if (!currentReplies) {
        return rootReplies;
    }
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


function updateComment(req, res, doc, username, paging) {
    NotesModel.update({username: username, _id: doc._id},{$set: {comment: doc.comment}}, function (err) {
        if (err){
            log.error('note addComment error:' + err);
            res.json(result.json(response.C606.status, response.C606.code, response.C606.msg, null));
            return;
        }
        if (paging) {
            NotesModel.find({username: username}).sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, docs) {
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
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    NotesModel.findOne({username: reply.username, _id: reply.doc_id}).exec(function (err, doc) {
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
        doc.comment.toObject();
        updateComment(req, res, doc, reply.username, JSON.parse(req.query.paging));
    });
};

//删除一个评论、回复
var isFindDelete = false;
function recursionSpliceChild(rootReply, currentReply, reply) {
    if (!currentReply) {
        return rootReply;
    }
    for (var i = 0; i < currentReply.length; i++){
        if (isFindDelete) {
            break;
        }else {
            if (currentReply[i]._id == reply.id) {
                currentReply.splice(i, 1);
                isFind = true;
                break;
            }else {
                recursionAppendChild(reply, rootReply, currentReply[i].replies);
            }
        }
    }
    return rootReply;
}




