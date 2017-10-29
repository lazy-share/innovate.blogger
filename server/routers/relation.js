/**
 * Created by lzy on 2017/10/29.
 */
var relationService = require('../service/relationship');
const env = require('../conf/environments');
const webRootApi = (require('../conf/sys_config')[env]).webRootUri;

module.exports = function (router) {
    router.get(webRootApi +'/private/my/relations', relationService.praiseAndCommentRelations);
    router.delete(webRootApi +'/private/my/relation', relationService.deleteRelation);
    router.get(webRootApi +'/private/my/relation/count', relationService.praiseAndCommentRelationCount);
};