/**
 * Created by laizhiyuan on 2017/9/5.
 *
 * <p>
 *   账号路由
 * </p>
 *
 */
var accountService = require('../service/account');
module.exports = function (router) {
    //注册验证
    router.get('/v1/api/web/register/validate', accountService.registerValidate);
    //注册
    router.post('/v1/api/web/register', accountService.register);
    //登录
    router.get('/account/login', accountService.login);
    //注销
    router.delete('/account/delete', accountService.deleteOne);
    //密保码验证
    router.get('/account/forget/encrypt/:encrypt', accountService.encryptValidate);
    //修改密码
    router.post('/account/password/update', accountService.updatePwd);
    //登出
    router.delete('/account/logout', accountService.logout);
};