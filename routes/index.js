/**
 * Created by lzy on 2017/9/6.
 *
 * <p>
 *     首页
 */
module.exports = function (app) {
    app.get('/', function (req, res) {
        res.locals.title = '爱情海博客';
        res.render("index");
    });
    
    app.get('/login', function (req, res) {
        res.locals.title = '欢迎登录';
        res.locals.loginMsg = false;
        res.render('login');
    });

    app.get('/register', function (req, res) {
        res.locals.title = '欢迎注册';
        res.locals.registerMsg = false;
        res.render('account/register');
    });

    app.get('/register/success', function (req, res) {
        res.locals.title = '注册成功';
        res.render('account/success');
    });

    app.get('/forget/success', function (req, res) {
        res.locals.title = '修改密码成功';
        res.render('account/success');
    });

    app.get('/forget', function (req, res) {
        res.locals.title = '找回密码';
        res.render('account/forget');
    });

    app.get('/logout', function (req, res) {
        res.locals.title = '爱情海博客';
        req.session.destroy();
        res.redirect('/');
    })
};