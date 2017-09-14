/**
 * Created by lzy on 2017/9/2.
 *
 * <p>账号服务层
 */
var mongoose = require('mongoose');
require('../models/account');
var AccountModel = mongoose.model('AccountModel');
var AccountInfoModel = mongoose.model('AccountInfoModel');
var crypto = require('crypto');

//注册
exports.register = function (req, res) {
    var account = new AccountModel(req.body.account);
    account.set('password', hashPwd(req.body.account.password));
    var accoutInfo = new AccountInfoModel();
    accoutInfo.set('username', account.username);
    var AddressModel = mongoose.model('AddressModel');
    accoutInfo.set('address', new AddressModel({details: ''}));
    accoutInfo.save(function (err) {
        if (err){
            res.statusCode = 500;
            console.log('[ERROR]: register faild! errMsg: ' + err);
            res.json({code: false, msg: '注册失败!'});
            return;
        }else {
            account.save(function (err) {
                if (err){
                    res.statusCode = 500;
                    console.log('[ERROR]: register faild! errMsg: ' + err);
                    res.json({code: false, msg: '注册失败!'});
                    return;
                }else {
                    req.session.account = account;
                    res.json({code: true, msg: '注册成功'});
                }
            });
        }
    });
};

//注销账号
exports.deleteOne = function (req, res) {
    var current = req.session.current;
    if (!current){
        res.redirect('/account/login');
        return;
    }
    var username = current.username;
    if (!username){
        console.log('param username is null or empty');
        res.json({code: false, msg: 'Session失效'});
        return;
    }else {
        AccountModel.findOne({username: username}, function (err, doc) {
            if (!doc){
                res.json({code: false, msg: '不存在该账号'});
                return;
            }
            try {
                require('./account_info').deleteOne(username);
                require('./articles_type').deleteByAccount(username);
                require('./articles').deleteByAccount(username);
                require('./notes').deleteByAccount(username);
                doc.remove(function (err) {
                    if (!err){
                        res.json({code: true, msg: '删除成功!'});
                        req.session.destroy();
                        return;
                    }else {
                        console.log('delete faild! errMsg:' + err);
                        res.json({code: false, msg: '删除失败!'});
                    }
                });
            }catch (err){
                console.log('deleteOne account err msg: ' + err);
                res.json({code: false, msg: '删除失败!'});
            }
        })
    }
};

//登陆验证
exports.login = function (req, res) {
    res.locals.title = '欢迎登录';
    var username = req.body.username;
    AccountModel.findOne({username: username})
        .exec(function (err, doc) {
            if (err){
                req.session.current = null;
                res.locals.loginMsg = '服务器错误!';
                res.render('login');
                return;
            }
            if (doc){
                if (doc.password === hashPwd(req.body.password.toString())){
                    req.session.regenerate(function() {
                        req.session.current = doc;
                        req.session.accountId = doc.username;
                        res.redirect('/center/' + doc.username);
                    })
                }else {
                    req.session.regenerate(function() {
                        req.session.current = null;
                        res.locals.loginMsg = '密码不正确!';
                        res.render('login');
                    })
                }
            }else {
                req.session.current = null;
                res.locals.loginMsg = '不存在该账号!';
                res.render('login');
            }
        });
};

//注册验证
exports.registerValidate = function (req, res) {
    var username = req.body.username;
    if (username){
        AccountModel.findOne({username: username}, function (err, doc) {
            if (err){
                console.log('registerValidate err! msg:' + err);
                res.json({code: false, msg:'系统错误!'});
                return;
            }
            if (doc){
                res.json({code: false, msg: '该账号已经存在!'});
            }else {
                res.json({code: true, msg: '该账号可以使用!'});
            }
        })
    }else {
        res.json({code: false, msg: '账号不能为空!'});
    }
};

//验证密保
exports.encryptValidate = function (req, res) {
    var encrypted = req.body.forget.encrypted;
    var username = req.body.forget.username;
    if (!encrypted || !username){
        res.json({code: false, msg: '参数encrypted和username不能为空'});
        return;
    }
    AccountModel.findOne({username: username})
        .exec(function (err, doc) {
            if (err){
                console.log('forgetPwd error , msg: ' + err);
                res.json({code: false, msg: '系统错误!'});
                return;
            }
            if (!doc){
                res.json({code: false, msg: '不存在该账号！'});
                return;
            }
            if (!(doc.encrypted == encrypted)){
                res.json({code: false, msg: '密保码不正确!'});
                return;
            }else {
                res.json({code: true, msg: '验证成功!'});
                return;
            }
        })
};

//修改密码
exports.updatePwd = function (req, res) {
    var username = req.body.forget.username;
    var pwd = hashPwd(req.body.forget.password);
    AccountModel.update({username: username}, {$set: {password: pwd}})
        .exec(function (err) {
            if (err){
                console.log('updatePwd error , msg: ' + err);
                res.json({code: false, msg: '系统错误!'});
                return;
            }
            res.json({code: true, msg: '修改成功！'});
        });
};

// //修改账户状态
// exports.updateStatus = function (req, res) {
//     var username = req.params.username;
//     var status = req.params.status;
//     AccountModel.update({username: username}, {$set: {status: status}})
//         .exec(function (err) {
//             if (err){
//                 console.log('updateStatus error , msg: ' + err);
//                 res.json({code: false, msg: '系统错误!'});
//                 return;
//             }
//             res.json({code: true, msg: '修改成功！'});
//         });
// };
//
//
// //根据用户名查找
// exports.findOne = function (req, res) {
//     var username = req.body.username;
//     if (!username){
//         console.log('param username is null or empty');
//         res.json({code: false, msg: '参数username不能为空'});
//         return;
//     }
//     AccountModel.findOne({username: username},function (err, doc) {
//         if (err){
//             console.log('findOne account error , msg: ' + err);
//             res.json({code: false, msg: '系统错误!'});
//             return;
//         }
//         res.json({code: true, msg: '查询成功!', data: doc});
//     });
// };

function hashPwd(pwd){
    if (pwd){
        return crypto.createHash('sha256').update(pwd).digest('base64').toString();
    }
    console.log('[Warning]: pwd is null or empty...');
    return pwd;
}



