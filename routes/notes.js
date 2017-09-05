/**
 * Created by laizhiyuan on 2017/9/5.
 *
 * <p>
 *    心情/日记 服务层
 * </p>
 *
 */
var notesService = require('../service/notes');

module.exports = function (app) {
    app.post('/notes/add', notesService.insert);
    app.post('/notes/update', notesService.update);
    app.get('/notes/deleteOne', notesService.deleteOne());
    app.get('/notes/findByAccount', notesService.findByAccount);
    app.get('/notes/visitor', notesService.visitor);
    app.get('/notes/praise', notesService.praise);
    app.get('/notes/findOne', notesService.findOne);
};
