/**
 * Created by lzy on 2017/9/2.
 *
 * <p>
 *     文章服务层
 */
var mongoose = require('mongoose');
require('../models/articles');
var ArticlesModel = mongoose.model('ArticlesModel');
var CommentModel = mongoose.model('CommentModel');
//新增文章
exports.insert = function (req, res) {
    var comment = new CommentModel({
        replies: []
    });
    var articlesModel = new ArticlesModel({
        username: req.body.username,
        title: req.body.title,
        desc: req.body.desc,
        type: req.body.type,
        content: req.body.content,
        praise: req.body.praise,
        comment: comment,
        visitor: 0
    });

    articlesModel.save(function (err, doc) {
        if (err){
            console.log('insert articles error, msg: ' + err);
            res.json({code: false, msg: '系统错误！'});
            return;
        }
        res.json({code: true, msg: '新增成功!'});
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