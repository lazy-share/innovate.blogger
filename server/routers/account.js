/**
 * Created by laizhiyuan on 2017/9/5.
 *
 * <p>
 *   账号路由
 * </p>
 *
 */
var accountService = require('../service/account');
const env = require('../conf/environments');
const webRootApi = (require('../conf/sys_config')[env]).webRootUri;
module.exports = function (router) {
    //注册验证
    router.get(webRootApi + '/register/validate', accountService.registerValidate);
    //注册
    router.post(webRootApi + '/register', accountService.register);
    //密保码验证
    router.get(webRootApi + '/forget/validate', accountService.forgetValidate);
    //忘记密码
    router.put(webRootApi + '/forget', accountService.forget);
    //登录
    router.post(webRootApi + '/login', accountService.login);
    //注销
    router.delete('/account/delete', accountService.deleteOne);
};