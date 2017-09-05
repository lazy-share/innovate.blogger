/**
 * Created by lzy on 2017/9/5.
 *
 * <p>
 *     文章类型 路由
 */
var articlesTypeService = require('../service/articles_type');

module.exports = function (app) {
    app.post('/articlesType/add', articlesTypeService.insert);
    app.get('/articlesType/findDefault', articlesTypeService.findByDefault);
    app.get('/articlesType/findByAccount', articlesTypeService.findByAccount);
    app.get('/articlesType/deleteOne', articlesTypeService.deleteOne);
};