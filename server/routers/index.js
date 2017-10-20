/**
 * Created by lzy on 2017/9/6.
 *
 * <p>
 *     首页  废弃
 */
var RelationshipModel = require('../models/relationship').RelationshipModel;
module.exports = function (router) {
    //首页
    router.get('/', function (req, res) {
        res.locals.title = 'LZY博客';
        res.render("index");
    });

    //个人中心
    router.get('/center/:username', function (req, res) {
        var username = req.params.username;
        if (!username) {
            res.redirect('/account/login');
            return;
        }
        var current = req.session.current;
        if (!current){
            res.redirect('/account/login');
        }
        //如果当前session的账号名和访问的username不一致，则尝试给对方添加一条访问数据
        if (current.username != username){
            var ip = req.ip;
            var subject = username;
            var from = current.username;

            //添加访问量条件：不同IP， 不同账号名，不同session type=2表示只查访问相关数据
            RelationshipModel.findOne({type:2, subject: subject, ip: ip}, function (err, doc) {
                if (err){
                    console.log(username + ' center error, errMsg: ' + err);
                    res.redirect('500');
                    return;
                }
                if (doc){
                    doc.set('update_time', Date.now());//更新最后访问时间
                    doc.save(function (err) {
                        if (err){
                            console.log(username + ' center error, errMsg: ' + err);
                            res.redirect('500');
                            return;
                        }
                        res.locals.title = '个人中心';
                        res.locals.username = username;
                        res.render("common/center");
                    });
                }else { //新增访问量
                    var relationshipModel = new RelationshipModel({
                        subject: subject,
                        from: from,
                        type: 2,
                        ip: ip
                    });
                    relationshipModel.save(function (err) {
                        if (err){
                            console.log(username + ' center error, errMsg: ' + err);
                            res.redirect('500');
                            return;
                        }
                        res.locals.title = '个人中心';
                        res.locals.username = username;
                        res.render("common/center");
                    });
                }
            })
        }else {
            res.locals.title = '个人中心';
            res.locals.username = username;
            res.render("common/center");
        }
    })
}