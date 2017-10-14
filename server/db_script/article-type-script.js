/**
 * Created by lzy on 2017/10/13.
 */
exports.initSysDefaultArticleType = function () {
    console.log('=================begin initSysDefaultArticleType=============================');
    var ArticleTypeModel = require('mongoose').model('ArticlesTypeModel');
    var initData = [
        new ArticleType('sys', 'WEB后台开发'),
        new ArticleType('sys', 'WEB前端开发'),
        new ArticleType('sys', 'Linux系统'),
        new ArticleType('sys', '大数据'),
        new ArticleType('sys', '分布式'),
        new ArticleType('sys', '关系型数据库'),
        new ArticleType('sys', 'NOSQL数据库'),
        new ArticleType('sys', '编程语言'),
        new ArticleType('sys', 'NodeJS'),
        new ArticleType('sys', '深度学习'),
        new ArticleType('sys', '人工智能'),
        new ArticleType('sys', 'AR')
    ];

    for (var i in initData){
        (function (item) {
            ArticleTypeModel.findOne({username: item.username, name: item.name}).exec(function (err, doc) {
                if (err) {
                    console.log('查询出错，errMsg:' + err - ' in ' - item.name);
                }else if (doc) {
                    console.log(doc.name + '已经存在，不再添加');
                }else {
                    var newO = new ArticleTypeModel({
                        name: item.name,
                        username: item.username
                    });
                    newO.save(function (err) {
                        if (err) {
                            console.log('保存' + item.name + '出错' + 'errMsg:' + err);
                        }else {
                            console.log('保存' + item.name + '成功');
                        }
                    });
                }
            });
        })(initData[i])
    }
};

function ArticleType(username, name) {
    var obj = new Object();
    obj.name = name;
    obj.username = username;
    return obj;
}