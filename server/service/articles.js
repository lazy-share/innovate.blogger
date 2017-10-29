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

/**
 * 文章列表
 * @param req
 * @param res
 */
exports.articles = function (req, res) {
    var username = req.query.username;
    var currentUsername = req.query.currentUsername;
    var isManuscript = req.query.isManuscript;
    if (!username || !currentUsername || !isManuscript) {
        log.error('articles params error: username or currentUsername is null' + username + '|' + currentUsername + '|' + isManuscript);
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    var paging = req.query.paging;
    paging = JSON.parse(paging);
    var queryOpt = {};
    if (paging.keyword){
        queryOpt = {username: username, is_manuscript: isManuscript, content: new RegExp(paging.keyword, 'i')};
    }else {
        queryOpt = {username: username, is_manuscript: isManuscript};
    }
    if (username != currentUsername){
        queryOpt.is_private = false;
        queryOpt.is_manuscript = false;
    }
    ArticlesModel.find(queryOpt).sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, articles) {
        if (err) {
            log.error('articles error, errMsg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        ArticleTypeModel.find({$or: [{username: username}, {username: 'sys'}]}).exec(function (err, types) {
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
    var username = req.query.username;
    var id = req.query.id;
    if (!username || !id) {
        log.error('select article params error: username or id is null' + username + '|' + id);
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }

    ArticlesModel.findOne({username: username, _id: id}).exec(function (err, article) {
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
    var username = req.body.username;
    var article = req.body.article;
    if (!username || !article) {
        log.error('edit article params error: username or article is null' + username + '|' + article);
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
    ArticlesModel.update({username: username, _id: article.id}, {$set: updateOpt}).exec(function (err) {
        if (err) {
            log.error('edit article error, errMsg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        var paging = req.body.paging;
        ArticlesModel.find({username: username, is_manuscript: article.isManuscript}).sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, articles) {
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
            username: article.username,
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
            var paging = req.body.paging;
            queryByPaging(res, article, paging, '新增文章后');
        });
    });
};

//删除文章
exports.delArticle = function (req, res) {
    var id = req.query.id;
    var username = req.query.username;
    if (!id || !username) {
        log.error('delArticle error, params id or username is null or empty' + id + '|' + username);
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    ArticlesModel.findOne({username: username, _id: id}).exec(function (err, article) {
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
        ArticlesModel.find({username: article.username, is_manuscript: article.isManuscript}).sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, docs) {
            if (err) {
                log.error(logMsg + '查询出错，error:' + err);
                res.json(result.json(response.C606.status, response.C606.code, response.C606.msg, null));
                return;
            }
            ArticlesModel.find({username: article.username, is_manuscript: article.isManuscript}).count().exec(function (err, count) {
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
    var username = req.query.username;
    var currentUsername = req.query.currentUsername;
    if (!id || !username || !currentUsername){
        log.error('article detail error, params is null or empty:' + id + '|' + username + '|' + currentUsername);
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    ArticlesModel.findOne({username: username, _id: id}).exec(function (err, article) {
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
            if (username != currentUsername){ //异步添加阅读数量
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
    var from = req.body.currentUsername;
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
            if (from != article.username){ //不是自己给自己点赞
                relationService.addPraiseRelation(article.username, from, article._id, RELATION.docType.ARTICLE); //异步插入一条赞动态相关
            }
        }else { //删除赞
            if (from != article.username){ //不是自己给自己点赞
                relationService.deletePraiseRelation(article.username, from, article._id, RELATION.docType.ARTICLE); //异步删除一条赞动态相关
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
                if (obj && article && obj.from_name != article.username){ //如果不是自己评论或回复则插入一条动态相关数据
                    relationService.addCommentRelation(article.username, reply.from_name, article._id, RELATION.docType.ARTICLE);
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
                        if (from_name != article.username){ //如果不是自己评论或回复删除一条动态相关数据
                            relationService.deleteCommentRelation(article.username, from_name, article._id, RELATION.docType.ARTICLE);
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
