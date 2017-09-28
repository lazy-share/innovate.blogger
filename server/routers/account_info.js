/**
 * Created by laizhiyuan on 2017/9/5.
 *
 * <p>
 *    账号信息服务层
 * </p>
 *
 */
var accountInfoService = require('../service/account_info');

module.exports = function (router) {
    //修改基本信息
    router.post('/accountInfo/update', accountInfoService.update);
    //基本信息
    router.get('/accountInfo/details/:username', accountInfoService.details);
    //修改头像
    router.post('/accountInfo/uploadHead/:username', accountInfoService.uploadHead);
    //关注他
    router.get('/accountInfo/concern/:username', accountInfoService.concern);
    //取消关注
    router.get('/accountInfo/cancleConcern/:username', accountInfoService.cancleConcern);
};
