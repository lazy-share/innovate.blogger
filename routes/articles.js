/**
 * Created by laizhiyuan on 2017/9/5.
 *
 * <p>
 *   文章路由
 * </p>
 *
 */
var articlesService = require('../service/articles');

module.exports = function (app) {
    app.post('/articles/add', articlesService.insert);
    app.get('/articles/findOne', articlesService.findOne);
    app.post('/articles/update', articlesService.update);
    app.get('/articles/deleteOne', articlesService.deleteOne);
    app.get('/articles/findByAccount', articlesService.findByAccount);
    app.get('/articles/visitor', articlesService.visitor);
    app.get('/articles/praise', articlesService.praise);
};
