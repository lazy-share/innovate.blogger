/**
 * Created by laizhiyuan on 2017/9/5.
 *
 * <p>
 *   文章路由
 * </p>
 *
 */
var articlesService = require('../service/articles');
const env = require('../conf/environments');
const webRootApi = (require('../conf/sys_config')[env]).webRootUri;

module.exports = function (router) {
    router.post(webRootApi + '/private/my/article', articlesService.addArticle);


    router.get('/articles/findOne', articlesService.findOne);
    router.post('/articles/update', articlesService.update);
    router.get('/articles/deleteOne', articlesService.deleteOne);
    router.get('/articles/findByAccount', articlesService.findByAccount);
    router.get('/articles/visitor', articlesService.visitor);
    router.get('/articles/praise', articlesService.praise);
};
