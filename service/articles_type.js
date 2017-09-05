/**
 * Created by lzy on 2017/9/2.
 *
 *  <p>
 *      文章类型
 */
var mongoose = require('mongoose');
var ArticlesTypeModel = mongoose.model('ArticlesTypeModel');
//添加文章类型
exports.insert = function (req, res) {
    var articleType = new ArticlesTypeModel({
        name: req.body.name,
        username: req.body.username
    });

    articleType.save(function (err) {
        if (err){
            console.log('save article type err , msg:' + err);
            res.json({code: false, msg: '系统错误!'});
            return;
        }
        res.json({code: true, msg: '保存成功!'});
    })
};

//查找所有的文章类型
exports.findByDefault = function (req,res) {
    ArticlesTypeModel.find({username: null}, function (err, docs) {
        if (err){
            console.log('findByDefault err , msg:' + err);
            res.json({code: false, msg: '系统错误!'});
            return;
        }
        res.json({code: true, msg: '查询成功!!', data: docs});
    });
};

//查找某个用户的所有文章类型
exports.findByAccount = function (req, res) {
    ArticlesTypeModel.find({username: null, name: req.body.username})
        .exec(function (err, docs) {
            if (err){
                console.log('findByAccount  err , msg:' + err);
                res.json({code: false, msg: '系统错误!'});
                return;
            }
            res.json({code: true, msg: '查询成功!!', data: docs});
        });
};

//删除 可通过username 或 ObjectId
exports.deleteOne = function (req, res) {
    var id = req.query.id;
    if (!id){
        console.log('param id not null or empty');
        res.json({code: false, msg: '参数id不能为空'});
        return;
    }
    ArticlesTypeModel.findOne({_id: id},function (err, doc) {
        if (err){
            console.log('deleteOne  err , msg:' + err);
            res.json({code: false, msg: '系统错误!'});
            return;
        }
        doc.remove(function (err) {
            if (err){
                console.log('deleteOne  err , msg:' + err);
                res.json({code: false, msg: '系统错误!'});
                return;
            }
            res.json({code: true, msg: '删除成功!'});
        });
    });
};