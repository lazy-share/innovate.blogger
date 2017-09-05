/**
 * Created by lzy on 2017/9/2.
 *
 * <p>账号服务层
 */
var mongoose = require('mongoose');
var AccountModel = mongoose.model('AccountModel');
var crypto = require('crypto');

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
            res.json({code: false, msg: '注册失败!'});
        }else {
            req.session.account = account;
            res.json({code: true, msg: '注册成功'});
        }
    });
};

//根据用户名删除
exports.deleteOne = function (req, res) {
    var username = req.query.username;
    if (!username){
        console.log('param username is null or empty');
        res.json('不存在参数username');
    }else {
        AccountModel.findOne({username: username}, function (err, doc) {
            if (doc){
                try {
                    require('./account_info').deleteOne(username);
                    require('./articles_type').deleteByAccount(username);
                    require('./articles').deleteByAccount(username);
                    require('./notes').deleteByAccount(username);
                    doc.remove(function (err) {
                        if (!err){
                            res.json({code: true, msg: '删除成功!'});
                        }else {
                            console.log('delete faild! errMsg:' + err);
                            res.jsonp({code: false, msg: '删除失败!'});
                        }
                    });
                }catch (err){
                    console.log('deleteOne account err msg: ' + err);
                    res.jsonp({code: false, msg: '删除失败!'});
                }
            }
        })
    }
};

//登陆验证
exports.loginValidate = function (req, res) {
    var username = req.body.username;
    AccountModel.findOne({username: username})
        .exec(function (err, doc) {
            if (doc){
                if (doc.password === hashPwd(req.body.password.toString())){
                    req.session.regenerate(function() {
                        req.session.account = doc;
                        res.json({code: true, msg: '登陆成功！'});
                    })
                }else {
                    req.session.regenerate(function() {
                        req.session.account = null;
                        res.json({code: false, msg: '密码错误!'});
                    })
                }
            }else {
                req.session.account = null;
                res.json({code: false, msg: '用户名错误!'})
            }
        });
};

//注册验证
exports.registerValidate = function (req, res) {
    var username = req.query.username;
    if (username){
        AccountModel.findOne({username: username}, function (err, doc) {
            if (err){
                console.log('registerValidate err! msg:' + err);
                res.jsonp({code: false, msg:'系统错误!'});
                return;
            }
            if (doc){
                res.jsonp({code: false, msg: '该用户名已经存在!'});
            }else {
                res.json({code: true, msg: '该用户名可以使用!'});
            }
        })
    }else {
        res.json("true");
    }
};

//验证密保
exports.encryptValidate = function (req, res) {
    var encrypted = req.query.encrypted;
    var username = req.query.username;
    if (!encrypted || !username){
        res.json({code: false, msg: '参数encrypted和username不能为空'});
        return;
    }
    AccountModel.findOne({encrypted: encrypted, username: username})
        .exec(function (err, doc) {
            if (err){
                console.log('forgetPwd error , msg: ' + err);
                res.json({code: false, msg: '系统错误!'});
                return;
            }
            if (!doc){
                res.json({code: false, msg: '密保问题错误！'});
                return;
            }
            res.json({code: true, msg: '验证成功!'});
        })
};

//修改密码
exports.updatePwd = function (req, res) {
    var username = req.body.username;
    var pwd = hashPwd(req.body.pwd);
    AccountModel.update({username: username}, {$set: {password: pwd}})
        .exec(function (err) {
            if (err){
                console.log('updatePwd error , msg: ' + err);
                res.json({code: false, msg: '系统错误!'});
                return;
            }
            res.json({code: true, msg: '修改成功！'});
        });
}

//修改账户状态
exports.updateStatus = function (req, res) {
    var username = req.query.username;
    var status = req.query.status;
    AccountModel.update({username: username}, {$set: {status: status}})
        .exec(function (err) {
            if (err){
                console.log('updateStatus error , msg: ' + err);
                res.json({code: false, msg: '系统错误!'});
                return;
            }
            res.json({code: true, msg: '修改成功！'});
        });
};


//根据用户名查找
exports.findOne = function (req, res) {
    var username = req.body.username;
    if (!username){
        console.log('param username is null or empty');
        res.json({code: false, msg: '参数username不能为空'});
        return;
    }
    AccountModel.findOne({username: username},function (err, doc) {
        if (err){
            console.log('findOne account error , msg: ' + err);
            res.json({code: false, msg: '系统错误!'});
            return;
        }
        res.json({code: true, msg: '查询成功!', data: doc});
    });
};

function hashPwd(pwd){
    if (pwd){
        return crypto.createHash('sha256').update(pwd).digest('base64').toString();
    }
    console.log('[Warning]: pwd is null or empty...');
    return pwd;
}



