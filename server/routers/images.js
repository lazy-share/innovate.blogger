/**
 * Created by lzy on 2017/10/28.
 */
var imageService = require('../service/image');
const env = require('../conf/environments');
const webRootApi = (require('../conf/sys_config')[env]).webRootUri;

module.exports = function (router) {
    router.get(webRootApi +'/private/my/images', imageService.images);
    router.post(webRootApi +'/private/my/image/:username/:skip/:limit', imageService.upload);
    router.post(webRootApi +'/private/my/image/praise', imageService.praise);
    router.post(webRootApi +'/private/my/image/comment', imageService.comment);
    router.delete(webRootApi +'/private/my/image/comment', imageService.delComment);
    router.delete(webRootApi +'/private/my/image', imageService.delImage);
};
