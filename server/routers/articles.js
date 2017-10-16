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
    router.get(webRootApi + '/private/my/articles', articlesService.articles);
    router.post(webRootApi + '/private/my/article', articlesService.addArticle);
    router.get(webRootApi + '/private/my/article', articlesService.article);
    router.get(webRootApi + '/private/my/article/detail', articlesService.detail);
    router.post(webRootApi + '/private/my/article/praise', articlesService.praise);
    router.post(webRootApi + '/private/my/article/comment', articlesService.comment);
    router.delete(webRootApi + '/private/my/article/comment', articlesService.delComment);
    router.put(webRootApi + '/private/my/article', articlesService.editArticle);
    router.delete(webRootApi + '/private/my/article', articlesService.delArticle);
    router.post(webRootApi + '/private/my/article/upload/images', articlesService.uploadImages);
};
