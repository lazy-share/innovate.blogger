/**
 * Created by laizhiyuan on 2017/9/5.
 *
 * <p>
 *   文章路由
 * </p>
 *
 */
var articlesService = require('../service/articles');

module.exports = function (router) {
    router.post('/articles/add', articlesService.insert);
    router.get('/articles/findOne', articlesService.findOne);
    router.post('/articles/update', articlesService.update);
    router.get('/articles/deleteOne', articlesService.deleteOne);
    router.get('/articles/findByAccount', articlesService.findByAccount);
    router.get('/articles/visitor', articlesService.visitor);
    router.get('/articles/praise', articlesService.praise);
};
