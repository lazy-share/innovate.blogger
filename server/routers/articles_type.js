/**
 * Created by lzy on 2017/9/5.
 *
 * <p>
 *     文章类型 路由
 */
var articlesTypeService = require('../service/articles_type');

module.exports = function (router) {
    router.post('/articlesType/add', articlesTypeService.insert);
    router.get('/articlesType/findDefault', articlesTypeService.findByDefault);
    router.get('/articlesType/findByAccount', articlesTypeService.findByAccount);
    router.get('/articlesType/deleteOne', articlesTypeService.deleteOne);
};