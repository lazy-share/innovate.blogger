/**
 * Created by lzy on 2017/9/3.
 *
 * <p>
 *     账号信息服务层
 */
var mongoose = require('mongoose');
require('../models/account_info');
var AccountInfoModel = mongoose.model('AccountInfoModel');

//通过用户名查找用户详细信息
exports.findOne = function (req, res) {
    var username = req.query.username;
    if (!username) {
        res.json({code: false, msg: '参数username不能为空'});
        return;
    }
    AccountInfoModel.findOne({username: username}, function (err, doc) {
        if (err){
            console.log('find account info error, msg: ' + err);
            res.json({code: false, msg: '系统错误！'});
            return;
        }
        if (doc){
            res.json({code: true, msg: '查找用户信息成功！', data: doc});
        }
    })
};

//根据用户名修改用户信息
exports.update = function (req, res) {
    var username = req.body.username;
    if (!username) {
        res.json({code: false, msg: '参数username不能为空'});
        return;
    }
    AccountInfoModel.update({username: username}, {$set: {
        email: req.body.email,
        birthday: req.body.birthday,
        gender: req.body.gender,
        address: req.body.address,
        photo_url: req.body.photo_url,
        job: req.body.job,
        encrypted: req.body.encrypted,
        qq: req.body.qq,
        mobile: req.body.mobile
    }}).exec(function (err) {
        if (err){
            console.log('update account info error, msg: ' + err);
            res.json({code: false, msg: '系统错误！'});
            return;
        }
        res.json({code: true, msg: '更新成功!'});
    });

};

//根据用户名删除
exports.deleteOne = function (username) {
    if (!username) {
        // res.json({code: false, msg: '参数username不能为空'});
        console.log('参数username不能为空')
        return false;
    }
    AccountInfoModel.findOne({username: username}, function (err, doc) {
        if (err){
            console.log('delete account info error, msg: ' + err);
            // res.json({code: false, msg: '系统错误！'});
            throw new Error(err);
        }
        if (doc){
            doc.remove(function (err) {
                if (err){
                    console.log('delete account info error, msg: ' + err);
                    // res.json({code: false, msg: '系统错误！'});
                    throw new Error(err);
                }
                return true;
                // res.json({code: true, msg: '删除成功!'});
            });
        }else {
            // res.json({code: false, msg: '没有该用户'});
            console.log('========>  查无数据!');
            return false;
        }
    });
};

//新增
exports.insert = function (req, res) {
    var accountInfo = new AccountInfoModel({
        username: req.body.username,
        email: req.body.email,
        birthday: req.body.birthday,
        gender: req.body.gender,
        address: req.body.address,
        photo_url: req.body.photo_url,
        job: req.body.job,
        encrypted: req.body.encrypted,
        qq: req.body.qq,
        mobile: req.body.mobile
    });

    accountInfo.save(function (err, doc) {
        if (err){
            console.log('save account info error, msg: ' + err);
            res.json({code: false, msg: '系统错误！'});
            return;
        }
        res.json({code: true, msg: '添加成功!', data: accountInfo});
    })
};