/**
 * Created by lzy on 2017/9/5.
 *
 * <p>
 *     评论/回复 路由
 */
var commentService = require('../service/comment');

module.exports = function (router) {
    router.post('/comment/add', commentService.addComment);
    router.get('/comment/findOne', commentService.findOne);
};