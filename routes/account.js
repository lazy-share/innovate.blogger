/**
 * Created by laizhiyuan on 2017/9/5.
 *
 * <p>
 *   账号路由
 * </p>
 *
 */
var accountService = require('../service/account');

module.exports = function (app) {
    //注册
    app.post('/account/register', accountService.register);
    //登录
    app.post('/account/login', accountService.login);
    //注册验证
    app.post('/account/registerValidate', accountService.registerValidate);
    //注销
    app.get('/account/deleteOne', accountService.deleteOne);
    //密保码验证
    app.post('/account/encryptValidate', accountService.encryptValidate);
    //修改密码
    app.post('/account/updatePwd', accountService.updatePwd);
    //去登录
    app.get('/account/login', function (req, res) {
        res.locals.title = '欢迎登录';
        res.locals.loginMsg = false;
        res.render('login');
    });
    //去登出
    app.get('/account/logout', function (req, res) {
        res.locals.title = 'LZY博客';
        req.session.destroy();
        res.redirect('/');
    });
    //去注册
    app.get('/account/register', function (req, res) {
        res.locals.title = '欢迎注册';
        res.locals.registerMsg = false;
        res.render('account/register');
    });
    app.get('/account/register/success', function (req, res) {
        res.locals.title = '注册成功';
        res.render('account/success');
    });
    app.get('/account/forget/success', function (req, res) {
        res.locals.title = '修改密码成功';
        res.render('account/success');
    });
    //去找回密码
    app.get('/account/forget', function (req, res) {
        res.locals.title = '找回密码';
        res.render('account/forget');
    });
    app.get('/account/notAccount', function (req, res) {
        res.locals.title = '提示';
        res.locals.content = '不存在该账号!';
        res.render('account/info');
    });
}