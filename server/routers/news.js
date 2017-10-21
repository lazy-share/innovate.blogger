/**
 * Created by laizhiyuan on 2017/10/20.
 *
 * <p>
 *   新闻路由
 * </p>
 *
 */
const env = require('../conf/environments');
const webRootApi = (require('../conf/sys_config')[env]).webRootUri;
var newsService = require('../service/news');

module.exports = function (router) {
    router.get(webRootApi +'/news/types', newsService.newsTypes);
    router.get(webRootApi +'/news', newsService.news);
};
