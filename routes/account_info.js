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
    app.post('/accountInfo/update', accountInfoService.update);
    app.post('/accountInfo/add', accountInfoService.insert);
    app.get('/accountInfo/details/:username', accountInfoService.findOne);
    app.get('/accountInfo/index/:username', accountInfoService.center);
};
