/**
 * Created by laizhiyuan on 2017/9/5.
 *
 * <p>
 *    账号信息服务层
 * </p>
 *
 */
var accountInfoService = require('./account_info');

module.exports = function (app) {
    //修改基本信息
    app.post('/accountInfo/update', accountInfoService.update);
    //基本信息
    app.get('/accountInfo/details/:username', accountInfoService.details);
    //修改头像
    app.post('/accountInfo/uploadHead/:username', accountInfoService.uploadHead);
    //关注他
    app.get('/accountInfo/concern/:username', accountInfoService.concern);
    //取消关注
    app.get('/accountInfo/cancleConcern/:username', accountInfoService.cancleConcern);
};
