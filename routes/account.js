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
    app.post('/account/register', accountService.register);
    app.post('/account/loginValidate', accountService.loginValidate);
    app.post('/account/registerValidate', accountService.registerValidate);
    app.get('/account/deleteOne', accountService.deleteOne);
    app.get('/account/encryptValidate', accountService.encryptValidate);
    app.post('/account/updatePwd', accountService.updatePwd);
    app.post('/account/updateStatus', accountService.updateStatus);
}