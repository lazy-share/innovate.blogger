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
    //我、TA的关注
    router.get(webRootApi + '/private/my/attentions', accountInfoService.attentions);
    //关注我、TA的
    router.get(webRootApi + '/private/my/fans', accountInfoService.fans);
    //关注他
    router.post(webRootApi + '/private/my/attention', accountInfoService.attention);
    //取消关注
    router.delete(webRootApi + '/private/my/attention', accountInfoService.cancleAttention);
    //我、TA的访客
    router.get(webRootApi + '/private/my/visitors', accountInfoService.visitors);
    //添加访客
    router.post(webRootApi + '/private/my/visitors', accountInfoService.addVisitor);
};
