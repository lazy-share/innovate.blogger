/**
 * Created by lzy on 2017/10/28.
 */
var mongoose = require('mongoose');
var ImageModel = mongoose.model('ImageModel');
var CommentModel = mongoose.model('CommentModel');
var ReplyModel = mongoose.model('ReplyModel');
var result = require('../common/result');
var response = require('../common/response');
var sysConnfig = require('../conf/sys_config');
var env = require("../conf/environments");
var log = require('log4js').getLogger('image');
var fs = require("fs");
var relationService = require('./relationship');
var RELATION = require('../common/relation_enum');
var AccountModel = mongoose.model('AccountModel');

/**
 * 获取图片列表
 * @param req
 * @param res
 */
exports.images = function (req, res) {
    log.info('===============enter images================');
    var account_id = req.query.account_id;
    var current = req.query.currentUsername;
    var paging = req.query.paging;
    if (!account_id || !current || !paging){
        log.error('images params error, ' + account_id + '|' + current + '|' + paging);
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    paging = JSON.parse(paging);
    ImageModel.find({is_private: false, account_id: account_id}).sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, images) {
        if (err) {
            log.error('images error: errMsg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        ImageModel.find({is_private: false, account_id: account_id}).count(function (err, count) {
            if (err) {
                log.error('images error: errMsg:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            if (account_id != current){ //添加访问量
                for (var i in images){
                    images[i].visitor = images[i].visitor + 1;
                    (function (image) {
                        ImageModel.update({account_id: account_id, _id: image._id}, {$inc: {visitor: 1}}).exec(function (err) {
                            if (err) {
                                log.error(image._id + 'add visitor err:' + err);
                            }
                        });
                    })(images[i])
                }
            }
            var obj = {images: images, count: count};
            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, obj));
        });
    });
};

//评论
exports.comment = function (req, res) {
    var reply = req.body.reply;
    if (!reply){
        log.error('image post comment error: params error :' + reply + '|' + JSON.stringify(reply));
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    ImageModel.findOne({account_id: reply.account_id, _id: reply.doc_id}).exec(function (err, doc) {
        if (err) {
            log.error('image post comment error:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        if (doc.account_id != reply.from) {
            relationService.addCommentRelation(doc.account_id, reply.from, doc._id, RELATION.docType.IMAGE);
        }
        var accIds = [];
        accIds.push(reply.from);
        accIds.push(reply.subject);
        AccountModel.find({_id: {$in: accIds}}).exec(function (err, accs) {
            if (err) {
                log.error('image post comment error:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            var nowTime = new Date();
            var newReply = {};
            if (String(accs[0]._id) == accIds[0]){
                newReply = new ReplyModel({
                    create_time: nowTime,
                    update_time: nowTime,
                    content: reply.content,
                    from: accs[0],
                    subject: accs[1],
                    parent_id: reply.parent_id
                });
            }else {
                newReply = new ReplyModel({
                    create_time: nowTime,
                    update_time: nowTime,
                    content: reply.content,
                    from: accs[1],
                    subject: accs[0],
                    parent_id: reply.parent_id
                });
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
    ImageModel.update({account_id: account_id, _id: doc._id},{$set: {comment: doc.comment}}, function (err) {
        if (err){
            log.error('image addComment error:' + err);
            res.json(result.json(response.C606.status, response.C606.code, response.C606.msg, null));
            return;
        }
        if (paging) {
            ImageModel.find({account_id: account_id}).sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, docs) {
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
        log.error('image delComment error: params error :' + reply + '|' + JSON.stringify(reply));
        res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
        return;
    }
    ImageModel.findOne({account_id: reply.account_id, _id: reply.doc_id}).exec(function (err, doc) {
        if (err) {
            log.error('delComment error:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        if (!doc) {
            log.error('delComment error: image not found');
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
                    if (obj.from != reply.account_id){
                        relationService.deleteCommentRelation(reply.account_id, obj.from, reply.doc_id, RELATION.docType.IMAGE);
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

//赞
exports.praise = function (req, res) {
    var account_id = req.body.account_id;
    var from = req.body.from;
    var id = req.body.id;
    var paging = req.body.paging;
    if (!account_id || !from ||!id){
        log.error('image praise error: params error :' + account_id + '|' + from + '|' + id);
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    ImageModel.findOne({account_id: account_id, _id: id}).exec(function (err, doc) {
        if (err) {
            log.error('image praise error:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }

        var isExists = false;
        for (var i in doc.praise){
            if (String(doc.praise[i]._id) == from){
                doc.praise.splice(i, 1);
                isExists = true;
                break;
            }
        }
        if (isExists) {
            if (doc.account_id != from) { //如果不是自己赞自己，则删除一条动态相关数据
                relationService.deletePraiseRelation(doc.account_id, from, doc._id, RELATION.docType.IMAGE);
            }
            doc.save(function (err) {
                if (err) {
                    log.error('image praise error:' + err);
                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                    return;
                }
                if (paging) {
                    ImageModel.find({account_id: account_id}).sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, docs) {
                        if (err) {
                            log.error('删除赞后查询出错，error:' + err);
                            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                            return;
                        }
                        res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, docs));
                    });
                }else {
                    res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, null));
                }
            })
        }else {
            if (doc.account_id != from) { //如果不是自己赞自己，则添加一条动态相关数据
                relationService.addPraiseRelation(doc.account_id, from, doc._id, RELATION.docType.IMAGE);
            }
            AccountModel.findOne({_id: from}).exec(function (err, acc) {
                if (err) {
                    log.error('image praise error:' + err);
                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                    return;
                }
                doc.praise.push(acc);
                doc.save(function (err) {
                    if (err) {
                        log.error('image praise error:' + err);
                        res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                        return;
                    }
                    if (paging) {
                        ImageModel.find({account_id: account_id}).sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, docs) {
                            if (err) {
                                log.error('删除赞后查询出错，error:' + err);
                                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                                return;
                            }
                            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, docs));
                        });
                    }else {
                        res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, null));
                    }
                })
            });

        }
    });
};

/**
 * 上传
 * @param req
 * @param res
 */
exports.upload = function (req, res) {
    log.info('==========enter image upload');
    var account_id = req.params.account_id;
    var skip = req.params.skip;
    var limit = req.params.limit;
    if (!account_id || !skip || !limit){
        log.error('images upload param error:' + account_id + '|' + skip + '|' + limit);
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    var multiparty = require('multiparty');
    var util = require('util');
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({uploadDir: sysConnfig[env].upload_root_dir + sysConnfig[env].upload_photo_dir});
    //上传完成后处理
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log('upload photo error: ' + err);
            log.error("upload photo error: " + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        var inputFile = files.uploadfile[0];
        log.info(account_id + " 成功上传图片：" + inputFile.path);
        var oldFilePath = inputFile.path;
        if (oldFilePath.indexOf('\\') > -1) {
            oldFilePath = oldFilePath.replace(/\\/g, '/');
        }
        var startIndex = oldFilePath.indexOf(sysConnfig[env].upload_photo_dir);
        var filePath = oldFilePath.substring(startIndex, oldFilePath.length);
        filePath = sysConnfig[env].thisDoman + filePath;

        var nowTime = new Date();
        var comment = new CommentModel({
            replies: []
        });
        var newImage = new ImageModel({
            visitor: 0,
            praise: [],
            account_id: account_id,
            comment: comment,
            image_url: filePath,
            update_time: nowTime,
            create_time: nowTime,
            interspace_name: acc.interspace_name,
            head_portrait: acc.head_portrait
        });
        newImage.save(function (err) {
            if (err){
                log.error("upload photo success, save to database error: " + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            skip = parseInt(skip);
            limit = parseInt(limit);
            ImageModel.find({account_id: account_id}).sort({update_time: -1}).skip(skip).limit(limit).exec(function (err, images) {
                if (err){
                    log.error("upload photo and save photo success, query error: " + err);
                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                    return;
                }
                ImageModel.find({account_id: account_id}).count(function (err, count) {
                    if (err){
                        log.error("upload photo and save photo success, query error: " + err);
                        res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                        return;
                    }
                    var obj = {images: images, count: count};
                    res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, obj));
                });
            })
        })
    })
};

exports.delImage = function (req, res) {
    var image = req.query.image;
    var paging = req.query.paging;
    if (!image){
        log.error("del image params error; image:" + image);
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    image = JSON.parse(image);
    ImageModel.findOne({_id: image._id}).exec(function (err, image) {
        if (err) {
            log.error('delete image error, errMsg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        if (!image){
            log.error('delete image error, 图片查无数据');
            res.json(result.json(response.C605.status, response.C605.code, response.C605.msg, null));
            return;
        }
        var startIndex = image.image_url.lastIndexOf('/');
        var imageFileName = image.image_url.slice(startIndex + 1, image.image_url.length);
        var uploadPhotoDir = sysConnfig[env].upload_root_dir + sysConnfig[env].upload_photo_dir;
        var imageFilePath = uploadPhotoDir + '/' + imageFileName;
        if (imageFilePath.indexOf('\\') > -1){
            imageFilePath = imageFilePath.replace(/\\/g, '/');
        }
        if(fs.existsSync(imageFilePath) ) {
            fs.unlink(imageFilePath, function (err) {
                if (err){
                    log.error('del image error, 删除图片错误' + err);
                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                    return;
                }
                image.remove(function (err) {
                    if (err){
                        log.error('del image error, 删除图片后删除数据库数据错误' + err);
                        res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                        return;
                    }
                    relationService.deletePraiseAndCommentByDeleteDoc(image._id, RELATION.docType.IMAGE);
                    paging = JSON.parse(paging);
                    ImageModel.find({account_id: image.account_id}).sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, images) {
                        if (err) {
                            log.error('del image error, errMsg:' + err);
                            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                            return;
                        }
                        ImageModel.find({account_id: image.account_id}).count(function (err, count) {
                            if (err) {
                                log.error('del images error, errMsg:' + err);
                                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                                return;
                            }
                            var obj = {images: images, count: count};
                            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, obj));
                        });
                    });
                });
            });

        }else{
            res.json(result.json(response.C609.status, response.C609.code, response.C609.msg, null));
        }
    });
};
