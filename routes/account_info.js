/**
 * Created by laizhiyuan on 2017/9/5.
 *
 * <p>
 *    账号信息服务层
 * </p>
 *
 */
var accountInfoService = require('../service/account_info');

module.exports = function (app) {
    //修改账号信息
    app.post('/accountInfo/update', accountInfoService.update);
    //账号详情
    app.get('/accountInfo/details/:username', accountInfoService.details);
    //个人信息页面
    app.get('/accountInfo/index/:username', accountInfoService.index);
    //修改头像
    app.post('/accountInfo/uploadHead/:username', accountInfoService.uploadHead);
    //关注他
    app.get('/accountInfo/concern/:username', accountInfoService.concern);
    //取消关注
    app.get('/accountInfo/cancleConcern/:username', accountInfoService.cancleConcern);
};
