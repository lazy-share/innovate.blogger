/**
 * Created by lzy on 2017/9/2.
 *
 * <p>
 *     文章服务层
 */
var mongoose = require('mongoose');
require('../models/articles');
var ArticlesModel = mongoose.model('ArticlesModel');
var ArticleTypeModel = mongoose.model('ArticlesTypeModel');
var CommentModel = mongoose.model('CommentModel');
var ReplyModel = mongoose.model('ReplyModel');
var AccountInfoModel = mongoose.model('AccountInfoModel');
var result = require('../common/result');
var response = require('../common/response');
var log = require('log4js').getLogger('article');
var sysConnfig = require('../conf/sys_config');
var env = require("../conf/environments");
var relationService = require('./relationship');
var RELATION = require('../common/relation_enum');
var artilceImageService = require('../service/article_image');

/**
 * 文章列表
 * @param req
 * @param res
 */
exports.articles = function (req, res) {
    var account_id = req.query.account_id;
    var current_account_id = req.query.current_account_id;
    var isManuscript = req.query.isManuscript;
    if (!account_id || !current_account_id || !isManuscript) {
        log.error('articles params error: account_id or current_account_id is null' + account_id + '|' + current_account_id + '|' + isManuscript);
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    var paging = req.query.paging;
    paging = JSON.parse(paging);
    var queryOpt = {};
    if (paging.keyword){
        queryOpt = {account_id: account_id, is_manuscript: isManuscript, content: new RegExp(paging.keyword, 'i')};
    }else {
        queryOpt = {account_id: account_id, is_manuscript: isManuscript};
    }
    if (account_id != current_account_id){
        queryOpt.is_private = false;
        queryOpt.is_manuscript = false;
    }
    ArticlesModel.find(queryOpt).sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, articles) {
        if (err) {
            log.error('articles error, errMsg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        ArticleTypeModel.find({$or: [{account_id: account_id}, {account_id: 'sys'}]}).exec(function (err, types) {
            if (err) {
                log.error('articles error, errMsg:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            ArticlesModel.count(queryOpt, function (err, count) {
                if (err) {
                    log.error('articles error, errMsg:' + err);
                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                    return;
                }
                var obj = {articles: articles, articleType: types, count: count};
                res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, obj));
            });
        });
    });
};

/**
 * 查一篇文章
 * @param req
 * @param res
 */
exports.article = function (req, res) {
    var account_id = req.query.account_id;
    var id = req.query.id;
    if (!account_id || !id) {
        log.error('select article params error: account_id or id is null' + account_id + '|' + id);
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }

    ArticlesModel.findOne({account_id: account_id, _id: id}).exec(function (err, article) {
        if (err) {
            log.error('select article error, errMsg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        ArticleTypeModel.findOne({_id: article.type}).exec(function (err, type) {
            if (err) {
                log.error('select article error, errMsg:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            var obj = {article: article, type_name: type.name};
            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, obj));
        });
    });
};

/**
 * 保存编辑文章
 * @param req
 * @param res
 */
exports.editArticle = function (req, res) {
    var account_id = req.body.account_id;
    var article = req.body.article;
    if (!account_id || !article) {
        log.error('edit article params error: account_id or article is null' + account_id + '|' + article);
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }

    var updateOpt = {
        is_private: article.isPrivate,
        title: article.title,
        desc:article.desc,
        content: article.content,
        type: article.type,
        update_time: new Date(),
        is_manuscript: article.isManuscript
    };
    ArticlesModel.update({account_id: account_id, _id: article.id}, {$set: updateOpt}).exec(function (err) {
        if (err) {
            log.error('edit article error, errMsg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        artilceImageService.setDocId(account_id, article.id);
        var paging = req.body.paging;
        ArticlesModel.find({account_id: account_id, is_manuscript: article.isManuscript}).sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, articles) {
            if (err) {
                log.error('edit article error, errMsg:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, {articles: articles}));
        });
    });
};

//新增文章
exports.addArticle = function (req, res) {
    var article = req.body.article;
    if (!article) {
        log.error('addArticle error, params article is null or empty');
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    var nowTime = new Date();
    var comment = new CommentModel({
        replies: []
    });
    comment.save(function (err, doc) {
        if (err) {
            log.error('addArticle error, params article is null or empty');
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        var newArticle = new ArticlesModel({
            account_id: article.account_id,
            content: article.content,
            praise: [],
            visitor: 0,
            comment: doc._id,
            create_time: nowTime,
            update_time: nowTime,
            type: article.type,
            title: article.title,
            desc: article.desc,
            is_private: article.isPrivate,
            is_manuscript: article.isManuscript
        });
        newArticle.save(function (err) {
            if (err){
                log.error('addArticle error, errMsg:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            ArticlesModel.findOne({account_id: newArticle.account_id, comment: newArticle.comment}).exec(function (err, articleDoc) {
                if (err){
                    log.error('addArticle select after error, errMsg:' + err);
                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                    return;
                }
                artilceImageService.setDocId(articleDoc.account_id, articleDoc._id);
                var paging = req.body.paging;
                queryByPaging(res, article, paging, '新增文章后');
            });
        });
    });
};

exports.cancle = function (req, res) {
    var account_id = req.query.account_id;
    if (!account_id){
        log.error('article cancle params error');
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    artilceImageService.deleteTempImagePath(account_id);
    res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, null));
};

//删除文章
exports.delArticle = function (req, res) {
    var id = req.query.id;
    var account_id = req.query.account_id;
    if (!id || !account_id) {
        log.error('delArticle error, params id or account_id is null or empty' + id + '|' + account_id);
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    ArticlesModel.findOne({account_id: account_id, _id: id}).exec(function (err, article) {
        if (err) {
            log.error('delArticle error, errMsg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        CommentModel.remove({_id: article.comment}).exec(function (err) {
            if (err) {
                log.error('delArticle remove comment error, errMsg:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            article.remove(function (err) {
                if (err) {
                    log.error('delArticle error, errMsg:' + err);
                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                    return;
                }
                artilceImageService.delByDocId(article._id, article.account_id);
                relationService.deletePraiseAndCommentByDeleteDoc(article._id, RELATION.docType.ARTICLE);
                var paging = req.query.paging;
                article.isManuscript = article.is_manuscript;
                queryByPaging(res, article, JSON.parse(paging), '删除文章后');
            })
        });
    });
};

function queryByPaging(res, article, paging, logMsg) {
    if (paging) {
        ArticlesModel.find({account_id: article.account_id, is_manuscript: article.isManuscript}).sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, docs) {
            if (err) {
                log.error(logMsg + '查询出错，error:' + err);
                res.json(result.json(response.C606.status, response.C606.code, response.C606.msg, null));
                return;
            }
            ArticlesModel.find({account_id: article.account_id, is_manuscript: article.isManuscript}).count().exec(function (err, count) {
                if (err) {
                    log.error(logMsg + '查询出错，error:' + err);
                    res.json(result.json(response.C606.status, response.C606.code, response.C606.msg, null));
                    return;
                }
                var obj = {articles: docs, count: count};
                res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, obj));
            });
        });
    } else { //不存在paging参数则不查
        res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, null));
    }
}

//上传图片
exports.uploadImages = function (req, res) {
    var account_id = req.params.account_id;
    if (!account_id){
        log.error("article uploadImages param error");
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    var multiparty = require('multiparty');
    var util = require('util');
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({uploadDir: sysConnfig[env].upload_root_dir + sysConnfig[env].upload_article_dir});
    //上传完成后处理
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log('article uploadImages error: ' + err);
            log.error("article uploadImages error: " + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        } else {
            var inputFile = files.thumbnail[0];
            log.info(" 成功上传图片：" + inputFile.path);
            var oldFilePath = inputFile.path;
            artilceImageService.addTempImagePath(account_id, oldFilePath);
            if (oldFilePath.indexOf('\\') > -1) {
                oldFilePath = oldFilePath.replace(/\\/g, '/');
            }
            var startIndex = oldFilePath.indexOf(sysConnfig[env].upload_article_dir);
            var filePath = oldFilePath.substring(startIndex, oldFilePath.length);
            filePath = sysConnfig[env].thisDoman + filePath;
            res.json({file_path: filePath});
        }
    });
};

/**
 * 文章全文
 * @param req
 * @param res
 */
exports.detail = function (req, res) {
    var id = req.query.id;
    var account_id = req.query.account_id;
    var current_account_id = req.query.current_account_id;
    if (!id || !account_id || !current_account_id){
        log.error('article detail error, params is null or empty:' + id + '|' + account_id + '|' + current_account_id);
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    ArticlesModel.findOne({account_id: account_id, _id: id}).exec(function (err, article) {
        if (err){
            log.error('article detail error:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        CommentModel.findOne({_id: article.comment}).exec(function (err, comment) {
            if (err){
                log.error('article detail error:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            if (account_id != current_account_id){ //异步添加阅读数量
                ArticlesModel.update({_id: id}, {$inc: {visitor: 1}}).exec(function (err) {
                    if (err){
                        log.error('异步添加阅读数量错误！err:' + err);
                        return;
                    }
                })
            }
            var obj = {article: article, comment: comment};
            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, obj));
        })
    });
};

/**
 * 赞
 * @param req
 * @param res
 */
exports.praise = function (req, res) {
    var id = req.body.id;
    var from = req.body.current_account_id;
    if (!id || !from){
        log.error('post praise error, params is null or empty:' + id + '|' + from );
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    ArticlesModel.findOne({_id: id}).exec(function (err, article) {
        if (err){
            log.error('post praise error:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        var isExists = false;
        for (var i in article.praise){
            if (article.praise[i] == from) { //已经赞过的就取消
                article.praise.splice(i, 1);
                isExists = true;
                break;
            }
        }
        if (!isExists){ //添加赞
            article.praise.push(from);
            if (from != article.account_id){ //不是自己给自己点赞
                relationService.addPraiseRelation(article.account_id, from, article._id, RELATION.docType.ARTICLE); //异步插入一条赞动态相关
            }
        }else { //删除赞
            if (from != article.account_id){ //不是自己给自己点赞
                relationService.deletePraiseRelation(article.account_id, from, article._id, RELATION.docType.ARTICLE); //异步删除一条赞动态相关
            }
        }
        article.save(function (err) {
            if (err){
                log.error('post praise error:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, article));
        });
    });
};

//评论
exports.comment = function (req, res) {
    var reply = req.body.reply;
    if (!reply){
        log.error('article post comment error: params error :' + reply + '|' + JSON.stringify(reply));
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    CommentModel.findOne({_id: reply.id}).exec(function (err, doc) {
        if (err) {
            log.error('article post comment error:' + err);
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
        (function (obj) {
            ArticlesModel.findOne({comment: obj.id}).exec(function (err, article) {
                if (err) {
                    log.error('article post comment addCommentRelation error:' + err);
                }
                if (obj && article && obj.from_name != article.account_id){ //如果不是自己评论或回复则插入一条动态相关数据
                    relationService.addCommentRelation(article.account_id, reply.from_name, article._id, RELATION.docType.ARTICLE);
                }
            });
        })(reply)
        if (!reply.parent_id) { //顶级评论发起者
            doc.replies.push(newReply);
            updateComment(res, doc);
            return;
        }else {
            var allComment = doc.replies;
            var newAllComent = recursionAppendChild(newReply, allComment, allComment);
            doc.replies = newAllComent;
            doc.toObject();
            updateComment(res, doc);
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

function updateComment(res, doc) {
    doc.save(function (err) {
        if (err){
            log.error('article post comment updateComment error:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, doc));
    });
}

//删除评论
exports.delComment = function (req, res) {
    var reply = req.query.reply;
    if (!reply){
        log.error('note delComment error: params error :' + reply + '|' + JSON.stringify(reply));
        res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
        return;
    }
    reply = JSON.parse(reply);
    CommentModel.findOne({ _id: reply.root_id}).exec(function (err, doc) {
        if (err) {
            log.error('article delComment error:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        var allComment = doc.replies;
        var newAllComment = recursionSpliceChild(allComment, allComment, reply);
        doc.replies = newAllComment;
        updateComment(res, doc);
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
                //如果本次删除不是自己的评论或回复，则删除一条动态相关数据
                (function (id, from_name) {
                    ArticlesModel.findOne({comment: id}).exec(function (err, article) {
                        if (err) {
                            log.error('article delete comment addCommentRelation error:' + err);
                        }
                        if (from_name != article.account_id){ //如果不是自己评论或回复删除一条动态相关数据
                            relationService.deleteCommentRelation(article.account_id, from_name, article._id, RELATION.docType.ARTICLE);
                        }
                    });
                })(reply.root_id, currentReply[i].from_name);
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
