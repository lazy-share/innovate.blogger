/**
 * Created by laizhiyuan on 2017/9/5.
 *
 * <p>
 *    账号信息服务层
 * </p>
 *
 */
const env = require('../conf/environments');
const webRootApi = (require('../conf/sys_config')[env]).webRootUri;
var accountInfoService = require('../service/account_info');

module.exports = function (router) {
    //基本信息
    router.get(webRootApi + '/private/account/info', accountInfoService.details);
    //修改基本信息
    router.put(webRootApi + '/private/account/info', accountInfoService.update);
    //修改头像
    router.post(webRootApi + '/private/account/info/head/:username', accountInfoService.uploadHead);
    //关注他
    router.get('/accountInfo/concern/:username', accountInfoService.concern);
    //取消关注
    router.get('/accountInfo/cancleConcern/:username', accountInfoService.cancleConcern);
};
