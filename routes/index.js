/**
 * Created by lzy on 2017/9/6.
 *
 * <p>
 *     首页
 */
module.exports = function (app) {
    app.get('/', function (req, res) {
        res.locals.title = 'LZY博客';
        res.render("index");
    });
};