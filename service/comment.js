/**
 * Created by laizhiyuan on 2017/9/5.
 *
 * <p>
 *    评论、回复服务层
 * </p>
 *
 */
var mongoose = require('mongoose');
var CommentModel = mongoose.model('CommentModel');
var ReplyModel = mongoose.model('ReplyModel');

exports.findOne = function (req, res) {
    var id = req.query.id;
    CommentModel.findOne({_id: id}, function (err, doc) {
        if (err){
            console.log('CommentModel findOne err, msg:' + err);
            res.json({code: false, msg: '系统错误!'});
            return;
        }
        if (!doc){
            res.json({code: false, msg: '查无数据!'});
            return;
        }
        res.json({code: true, msg: '查询成功!', data: doc});
    });
};

exports.deleteInId = function (ids) {
    if (ids instanceof Array){
         CommentModel.remove({_id: {$in: ids}}, function (err) {
            if (err){
                throw new Error(err);
            }else {
                return true;
            }
        });
    }
}

exports.addComment = function (req, res) {
    var comment_root_id = req.body.comment_root_id;
    var comment_parent_id = req.body.comment_parent_id;
    CommentModel.findOne({_id: comment_root_id}, function (err, doc) {
        if (err){
            console.log('CommentModel findOne err, msg:' + err);
            res.json({code: false, msg: '系统错误!'});
            return;
        }
        if (!doc){
            res.json({code: false, msg: '查无数据!'});
            return;
        }
        var reply = new ReplyModel({
            reply_name: req.body.reply_name,
            subject_name: req.body.subject_name,
            content: req.body.subject_name,
            replies: []
        });
        if (doc.id === comment_parent_id){
            doc.replies.push(reply);
            doc.save(function (err) {
                if (err){
                    console.log('CommentModel addComment err, msg:' + err);
                    res.json({code: false, msg: '系统错误!'});
                    return;
                }
                res.json({code: true, msg: '评论成功!'});
            });
        }else {
            addComment(doc, doc, comment_parent_id, newReply, res);
        }
    });
};

function addComment(rootComment, currentComment, parentId, newReply, res) {
    for (var i = 0; i < currentComment.replies.length; i++){
        var reply = currentComment.replies[i];
        if (reply.id == parentId){
            reply.replies.push(newReply);
            rootComment.replies.toObject();
            updateComment(rootComment, res);
            break;
        }else {
            addComment(rootComment, reply, parentId, newReply, res);
        }
    }
}

function updateComment(rootComment, res) {
    CommentModel.update({_id: rootComment.id}, {$set: {replies: rootComment.replies}})
        .exec(function (err) {
            if (err){
                console.log('CommentModel updateComment err, msg:' + err);
                res.json({code: false, msg: '系统错误!'});
                return;
            }
            res.json({code: true, msg: '评论成功!'});
        });
}

