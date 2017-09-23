/**
 * Created by laizhiyuan on 2017/9/5.
 *
 * <p>
 *   账号路由
 * </p>
 *
 */
var accountService = require('./account');

module.exports = function (app) {
    //注册
    app.post('/account/register', accountService.register);
    //登录
    app.get('/account/login', accountService.login);
    //注册验证
    app.get('/account/register/validate/:username', accountService.registerValidate);
    //注销
    app.delete('/account/delete', accountService.deleteOne);
    //密保码验证
    app.get('/account/forget/encrypt/:encrypt', accountService.encryptValidate);
    //修改密码
    app.post('/account/password/update', accountService.updatePwd);
    //登出
    app.delete('/account/logout', accountService.logout);
};