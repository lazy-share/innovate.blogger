/**
 * Created by lzy on 2017/9/3.
 *
 * <p>
 *     评论/回复服务层
 */
var mongoose = require('mongoose');
var CommentModel = mongoose.model('CommentModel');

//新增一个评论
exports.insert = function (req, res) {
    var comment = new CommentModel({
        replies: []
    });

    if (req.body.username){
        comment.set('username', req.body.username);
    }
    if (req.body.parent_username){
        comment.set('parent_username', req.body.parent_username);
    }
    comment.save(function (err) {
        if (err){
            console.log('save comment err, msg:' + err);
            return null;
        }
        return comment._id;
    })
};

//通过ObjectId 查找
exports.findOne = function (req, res) {
    var id = req.query.id;
    if (id){
        CommentModel.findOne({_id: id}, function (err, doc) {
            if (err){
                console.log('findOne err! msg:' + err);
                res.json({code: false, msg: '系统错误!'});
                return;
            }
            res.json({code: true, msg: '成功', obj: doc});
        });
    }
};

//添加评论
exports.addComment = function (req, res) {

};

//删除一个评论
exports.deleteOne = function (req, res) {

};