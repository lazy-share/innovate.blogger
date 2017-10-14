/**
 * Created by lzy on 2017/9/5.
 *
 * <p>
 *     文章类型 路由
 */
var articlesTypeService = require('../service/articles_type');
const env = require('../conf/environments');
const webRootApi = (require('../conf/sys_config')[env]).webRootUri;

module.exports = function (router) {
    router.post(webRootApi + '/private/my/article/type', articlesTypeService.addArticleType);
    router.delete(webRootApi + '/private/my/article/type', articlesTypeService.delArticleType);

};