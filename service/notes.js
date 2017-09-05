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
//新增日记/心情
exports.insert = function (req, res) {
    var comment = new CommentModel({
        replies: []
    });
    var notes = new NotesModel({
        username: req.body.username,
        content: req.body.content,
        praise: [],
        visitor: 0,
        comment: comment
    });

    notes.save(function (err) {
        if (err){
            console.log('save notes error, msg:' + err);
            res.json({code: false, msg: '系统错误!'});
            return;
        }
        res.json({code: true, msg: '添加成功!'});
    });
};

//删除日记心情
exports.deleteOne = function (req, res) {
    var id = req.query.id;
    if (!id){
        console.log('delete notes id param is null or empty');
        res.json({code: false, msg: '参数id不能为空!'});
        return;
    }
    NotesModel.findOne({_id: id})
        .exec(function (err, doc) {
            if (err){
                console.log('delete notes error, msg:' + err);
                res.json({code: false, msg: '系统错误!'});
                return;
            }
            if (!doc){
                res.json({code: true, msg: '查无数据!'});
                return;
            }
            doc.remove(function (err) {
                if (err){
                    console.log('delete notes error, msg:' + err);
                    res.json({code: false, msg: '系统错误!'});
                    return;
                }
                res.json({code: true, msg: '删除成功!'});
            });
        });
};

//更新日记心情
exports.update = function (req, res) {
    var id = req.body.id;
    if (!id){
        console.log('update notes id param is null or empty');
        res.json({code: false, msg: '参数id不能为空!'});
        return;
    }
    NotesModel.update({_id: id}, {$set: {content: req.body.content}})
        .exec(function (err) {
            if (err){
                console.log('update notes error, msg:' + err);
                res.json({code: false, msg: '系统错误!'});
                return;
            }
            res.json({code: true, msg: '编辑成功!'});
        });
};

//查找某个账号的所有的日记
exports.findByAccount = function (req, res) {
    var username = req.query.username;
    if (!username){
        console.log('findByAccount notes username param is null or empty');
        res.json({code: false, msg: '参数username不能为空!'});
        return;
    }
    NotesModel.find({username: username})
        .exec(function (err, docs) {
            if (err){
                console.log('findByAccount notes error, msg:' + err);
                res.json({code: false, msg: '系统错误!'});
                return;
            }
            if (!docs){
                res.json({code: false, msg: '查无数据!'});
            }
            res.json({code: true, msg: '查询成功!', data: docs});
        });
};

//查找某个日记
exports.findOne = function (req, res) {
    var id = req.query.id;
    if (!id){
        console.log('findOne notes id param is null or empty');
        res.json({code: false, msg: '参数id不能为空!'});
        return;
    }
    NotesModel.findOne({_id: id}).exec(function (err, doc) {
        if (err){
            console.log('findOne notes error, msg:' + err);
            res.json({code: false, msg: '系统错误!'});
            return;
        }
        if (!doc){
            res.json({code: false, msg: '查无数据!'});
            return;
        }
        res.json({code: true, msg: '查询成功!', data: doc});
    })
};

//新增访问量
exports.visitor = function (req, res) {
    var id = req.query.id;
    if (!id){
        console.log('findOne notes id param is null or empty');
        res.json({code: false, msg: '参数id不能为空!'});
        return;
    }
    NotesModel.findOne({_id: id}, function (err, doc) {
        if (err){
            console.log('visitor notes error, msg:' + err);
            res.json({code: false, msg: '系统错误!'});
            return;
        }
        if (!doc){
            res.json({code: false, msg: '查无数据!'});
            return;
        }
        doc.set('visitor', doc.visitor + 1);
        doc.save(function (err) {
            if (err){
                console.log('visitor notes error, msg:' + err);
                res.json({code: false, msg: '系统错误!'});
                return;
            }
            res.json({code: true, msg: '更新成功!'});
        })
    })
};

//添加赞
exports.praise = function (req, res) {
    var username = req.body.username;
    var id = req.body.id;
    if (!username || !id){
        console.log('praise notes id and username param is null or empty');
        res.json({code: false, msg: '参数id、username不能为空!'});
        return;
    }
    NotesModel.findOne({_id: id}, function (err, doc) {
        if (err){
            console.log('praise notes error, msg:' + err);
            res.json({code: false, msg: '系统错误!'});
            return;
        }
        if (!doc){
            res.json({code: false, msg: '查无数据!'});
            return;
        }
        doc.praise.push(username);
        doc.save(function (err) {
            if (err){
                console.log('praise notes error, msg:' + err);
                res.json({code: false, msg: '系统错误!'});
                return;
            }
            res.json({code: true, msg: '更新成功!'});
        });
    })
};

exports.addComment = function (req, res) {
    var subjectId = req.body.subjectId;
    var reply = new ReplyModel({
        reply_name: req.body.reply_name,
        subject_name: req.body.subject_name,
        content: req.body.content,
        replies:[]
    });
    NotesModel.findOne({_id: subjectId})
        .exec(function (err, doc) {
            if (err){
                console.log('notes add comment err, msg:' + err);
                res.json({code: false, msg: '系统错误!'});
                return;
            }
            if (!doc){
                res.json({code: false, msg: '查无数据!'});
                return;
            }
            var comment = doc.comment;

        })

};


