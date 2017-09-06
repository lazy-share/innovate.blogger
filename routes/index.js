/**
 * Created by lzy on 2017/9/6.
 *
 * <p>
 *     首页
 */
module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render("index");
    });
};