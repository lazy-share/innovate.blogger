/**
 * Created by laizhiyuan on 2017/9/5.
 *
 * <p>
 *    心情/日记 服务层
 * </p>
 *
 */
var notesService = require('../service/notes');

module.exports = function (router) {
    router.post('/notes/add', notesService.insert);
    router.post('/notes/update', notesService.update);
    router.get('/notes/deleteOne', notesService.deleteOne);
    router.get('/notes/findByAccount', notesService.findByAccount);
    router.get('/notes/visitor', notesService.visitor);
    router.get('/notes/praise', notesService.praise);
    router.get('/notes/findOne', notesService.findOne);
};
