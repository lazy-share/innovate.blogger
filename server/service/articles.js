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
    if (!username) {
        log.error('articles params error: username is null');
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    var paging = req.query.paging;
    paging = JSON.parse(paging);
    ArticlesModel.find({username: username}).sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, articles) {
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
                AccountInfoModel.findOne({username: username}, {head_portrait: 1}).exec(function (err, doc) {
                    if (err) {
                        log.error('articles error, errMsg:' + err);
                        res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                        return;
                    }
                    var obj = {articles: articles, articleType: types, count: count, head_portrait: doc.head_portrait};
                    res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, obj));
                });
            });
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
            title: article.title
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

//编辑文章
exports.update = function (req, res) {
    var id = req.query.id;
    if (!id){
        console.log("update error, id param is null or empty");
        res.json({code: false, msg: '参数id不能为空!'});
        return;
    }
    ArticlesModel.update({_id: id},{$set: {
        title: req.body.title,
        content: req.body.content,
        desc: req.body.desc
    }}, function (err) {
        if (err){
            console.log('update articles error, msg: ' + err);
            res.json({code: false, msg: '系统错误！'});
            return;
        }
        res.json({code: true, msg: '编辑成功!'});
    })
};

//删除文章
exports.deleteOne = function (req, res) {
    var id = req.body.id;
    if (!id){
        console.log("delete error, id param is null or empty");
        res.json({code: false, msg: '参数id不能为空!'});
        return;
    }
    ArticlesModel.findOne({_id: id},function (err, doc) {
        if (err){
            console.log('delete articles error, msg: ' + err);
            res.json({code: false, msg: '系统错误！'});
            return;
        }
        if (doc){
            var commentId = [];
            commentId.push(doc.comment);
            try{
                require('./comment').deleteInId(commentId);
                doc.remove(function (err) {
                    if (err){
                        console.log('delete articles error, msg: ' + err);
                        res.json({code: false, msg: '系统错误！'});
                        return;
                    }
                    res.json({code: true, msg: '删除成功!'});
                });
            }catch (err){
                res.json({code: false, msg: '删除失败'});
            }
        }
    })
};

exports.deleteByAccount = function (username) {
    if (!username){
        return true;
    }
    ArticlesModel.find({username: username},function (err, docs) {
        if (docs){
            var commentIds = [];
            for (var doc in docs){
                commentIds.push(doc.comment);
            }
            try{
                require('./comment').deleteInId(commentIds);
                ArticlesModel.remove({username: username})
                    .exec(function (err) {
                        if (err){
                            throw new Error(err);
                        }else{
                            return true;
                        }
                    })
            }catch (err){
                throw new Error(err);
            }
        }
    });
};

//找出某个账号所有的文章
exports.findByAccount = function (req, res) {
    var username = req.query.username;
    if (!username){
        console.log("findByAccount username param is null or empty");
        res.json({code: false, msg: '参数username不能为空!'});
        return;
    }
    ArticlesModel.find({username: username}, function (err, docs) {
        if (err){
            console.log('findByAccount articles error, msg: ' + err);
            res.json({code: false, msg: '系统错误！'});
            return;
        }
        if (!docs){
            res.json({code: false, msg: '查无数据！'});
            return;
        }
        res.json({code: true, msg: '查询成功!', data: docs});
    });
};

//查找某篇文章
exports.findOne = function (req, res) {
    var id = req.query.id;
    if (!id){
        console.log("find error, id param is null or empty");
        res.json({code: false, msg: '参数id不能为空!'});
        return;
    }
    ArticlesModel.findOne({_id: id}, function (err, doc) {
        if (err){
            console.log('findOne articles error, msg: ' + err);
            res.json({code: false, msg: '系统错误！'});
            return;
        }
        if (!doc){
            res.json({code: false, msg: '查无数据！'});
            return;
        }
        res.json({code: true, msg: '查询成功!', data: doc});
    })
};

//访问量
exports.visitor = function (req, res) {
    var id = req.query.id;
    if (!id){
        console.log("visitor error, id param is null or empty");
        res.json({code: false, msg: '参数id不能为空!'});
        return;
    }
    ArticlesModel.findOne({_id: id},function (err, doc) {
        if (err){
            console.log('visitor articles error, msg: ' + err);
            res.json({code: false, msg: '系统错误！'});
            return;
        }
        if (!doc){
            res.json({code: false, msg: '查无数据！'});
            return;
        }
        doc.visitor = doc.visitor + 1;
        doc.save(function (err) {
            if (err){
                console.log('visitor articles error, msg: ' + err);
                res.json({code: false, msg: '系统错误！'});
                return;
            }
            res.json({code: true, msg: '更新成功!'});
        });
    });
}

//赞
exports.praise = function (req, res) {
    var id = req.query.id;
    var username = req.query.username;
    if (!username || !id){
        console.log('praise articles id and username param is null or empty');
        res.json({code: false, msg: '参数id、username不能为空!'});
        return;
    }
    ArticlesModel.findOne({_id: id}, function (err, doc) {
        if (err){
            console.log('praise articles error, msg: ' + err);
            res.json({code: false, msg: '系统错误！'});
            return;
        }
        if (!doc){
            res.json({code: false, msg: '查无数据！'});
            return;
        }
        doc.praise.push(username);
        doc.save(function (err) {
            if (err){
                console.log('praise articles error, msg: ' + err);
                res.json({code: false, msg: '系统错误！'});
                return;
            }
            res.json({code: true, msg: '更新成功！'});
        });
    });
};