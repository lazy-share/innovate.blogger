/**
 * Created by lzy on 2017/10/26.
 */
const env = require('../conf/environments');
const webRootApi = (require('../conf/sys_config')[env]).webRootUri;
var homeService = require('../service/home');

module.exports = function (router) {
    router.get(webRootApi + '/home/articles', homeService.articles);
    router.get(webRootApi + '/home/notes', homeService.notes);
};