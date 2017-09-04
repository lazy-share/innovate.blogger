/**
 * Created by lzy on 2017/9/2.
 *
 * <p>账号服务层
 */
var mongoose = require('mongoose');
var AccountModel = mongoose.model('AccountModel');
var crypto = require('crypto');
var Pagin = require('page_constant');

//注册
exports.register = function (req, res) {
    var account = new AccountModel({
        username: req.body.username,
        password: hashPwd(req.body.password)
    });

    account.save(function (err) {
        if (err){
            res.statusCode = 500;
            console.log('[ERROR]: register faild! errMsg: ' + err);
            res.redirect(Pagin.Register);
        }else {
            req.session.user = account;

        }
    });
};

//根据用户名删除
exports.deleteOne = function (req, res) {

};

//登陆验证
exports.loginValidate = function (req, res) {
    
};

//注册验证
exports.registerValidate = function (req, res) {
    
};

//忘记密码
exports.forgetPwd = function (req, res) {
    
};

//修改账户状态
exports.updateStatus = function (req, res) {

};

//修改密码
exports.updatePwd = function (req, res) {

};

//根据用户名和密码查找
exports.findOne = function (req, res) {

};

function hashPwd(pwd){
    if (pwd){
        return crypto.createHash('sha256').update(pwd).digest('base64').toString();
    }
    console.log('[Warning]: pwd is null or empty...');
    return pwd;
}



