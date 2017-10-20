/**
 * Created by laizhiyuan on 2017/10/20.
 *
 * <p>
 *   Ã½ÌåÂ·ÓÉ
 * </p>
 *
 */
const env = require('../conf/environments');
const webRootApi = (require('../conf/sys_config')[env]).webRootUri;
var mediaService = require('../service/media');

module.exports = function (router) {
    router.get(webRootApi +'/private/my/medias', mediaService.medias);
    router.delete(webRootApi +'/private/my/media', mediaService.delMedia);
    router.post(webRootApi +'/private/my/media/upload/:username/:skip/:limit', mediaService.upload);
};