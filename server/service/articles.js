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
var AccountInfoModel = mongoose.model('AccountInfoModel');
var result = require('../common/result');
var response = require('../common/response');
var log = require('log4js').getLogger('article');
var sysConnfig = require('../conf/sys_config');
var env = require("../conf/environments");

/**
 * 文章列表
 * @param req
 * @param res
 */
exports.articles = function (req, res) {
    var username = req.query.username;
    var currentUsername = req.query.currentUsername;
    if (!username || !currentUsername) {
        log.error('articles params error: username or currentUsername is null' + username + '|' + currentUsername);
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    var paging = req.query.paging;
    paging = JSON.parse(paging);
    var queryOpt = {username: username};
    if (username != currentUsername){
        queryOpt.is_private = false;
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
            ArticlesModel.count({username: username}, function (err, count) {
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
        update_time: new Date()
    };
    ArticlesModel.update({username: username, _id: article.id}, {$set: updateOpt}).exec(function (err) {
        if (err) {
            log.error('edit article error, errMsg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        var paging = req.body.paging;
        ArticlesModel.find({username: username}).sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, articles) {
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
            is_private: article.isPrivate
        });
        newArticle.save(function (err) {
            if (err){
                log.error('addArticle error, errMsg:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            var paging = req.body.paging;
            queryByPaging(res, article.username, paging, '新增文章后');
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
                var paging = req.query.paging;
                queryByPaging(res, username, JSON.parse(paging), '删除文章后');
            })
        });
    });
};

function queryByPaging(res, username, paging, logMsg) {
    if (paging) {
        ArticlesModel.find({username: username}).sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, docs) {
            if (err) {
                log.error(logMsg + '查询出错，error:' + err);
                res.json(result.json(response.C606.status, response.C606.code, response.C606.msg, null));
                return;
            }
            ArticlesModel.find({username: username}).count().exec(function (err, count) {
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
    var form = new multiparty.Form({uploadDir: process.cwd() + '/server/public/web/images/article'});
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
            var startIndex = inputFile.path.indexOf('\\public\\web\\images\\article');
            var filePath = inputFile.path.substring(startIndex, inputFile.path.length).replace(/\\/g, '/');
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
