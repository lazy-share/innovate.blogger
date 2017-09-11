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
    app.get('/accountInfo/findOne', accountInfoService.findOne);
    app.post('/accountInfo/update', accountInfoService.update);
    app.post('/accountInfo/add', accountInfoService.insert);
    app.get('/accountInfo/details/:username', accountInfoService.details);
    app.get('/accountInfo/index/:username', function (req, res) {
        res.locals.title = '个人中心';
        res.locals.username = req.params.username;
        res.render('account/center');
    });
};
