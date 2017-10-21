/**
 * Created by lzy on 2017/10/21.
 */
var mongoose = require('mongoose');
var NewsTypeModel = mongoose.model('NewsTypeModel');

const wangyi_news_info_arr = [
    {no: 'BA8J7DG9wangning', name: '推荐', priority: 1, url: 'http://3g.163.com/touch/article/list/BA8J7DG9wangning/20-20.html'},
    {no: 'BBM54PGAwangning', name: '新闻', priority: 2, url: 'http://3g.163.com/touch/article/list/BBM54PGAwangning/0-10.html'},
    {no: 'BA10TA81wangning', name: '娱乐', priority: 6, url: 'http://3g.163.com/touch/article/list/BA10TA81wangning/0-10.html'},
    {no: 'BA8E6OEOwangning', name: '体育', priority: 7, url: 'http://3g.163.com/touch/article/list/BA8E6OEOwangning/0-10.html'},
    {no: 'BA8EE5GMwangning', name: '财经', priority: 5, url: 'http://3g.163.com/touch/article/list/BA8EE5GMwangning/0-10.html'},
    {no: 'BA8F6ICNwangning', name: '时尚', priority: 13, url: 'http://3g.163.com/touch/article/list/BA8F6ICNwangning/0-10.html'},
    {no: 'BAI67OGGwangning', name: '军事', priority: 14, url: 'http://3g.163.com/touch/article/list/BAI67OGGwangning/0-10.html'},
    {no: 'BAI6I0O5wangning', name: '手机', priority: 15, url: 'http://3g.163.com/touch/article/list/BAI6I0O5wangning/0-10.html'},
    {no: 'BA8D4A3Rwangning', name: '科技', priority: 16, url: 'http://3g.163.com/touch/article/list/BA8D4A3Rwangning/0-10.html'},
    {no: 'BAI6RHDKwangning', name: '游戏', priority: 17, url: 'http://3g.163.com/touch/article/list/BAI6RHDKwangning/0-10.html'},
    {no: 'BAI6JOD9wangning', name: '数码', priority: 18, url: 'http://3g.163.com/touch/article/list/BAI6JOD9wangning/0-10.html'},
    {no: 'BA8FF5PRwangning', name: '教育', priority: 4, url: 'http://3g.163.com/touch/article/list/BA8FF5PRwangning/0-10.html'},
    {no: 'BDC4QSV3wangning', name: '健康', priority: 8, url: 'http://3g.163.com/touch/article/list/BDC4QSV3wangning/0-10.html'},
    {no: 'BA8DOPCSwangning', name: '汽车', priority: 9, url: 'http://3g.163.com/touch/article/list/BA8DOPCSwangning/0-10.html'},
    {no: 'BAI6P3NDwangning', name: '家居', priority: 10, url: 'http://3g.163.com/touch/article/list/BAI6P3NDwangning/0-10.html'},
    {no: 'BAI6MTODwangning', name: '房产', priority: 3, url: 'http://3g.163.com/touch/article/list/BAI6MTODwangning/0-10.html'},
    {no: 'BEO4GINLwangning', name: '旅游', priority: 11, url: 'http://3g.163.com/touch/article/list/BEO4GINLwangning/0-10.html'},
    {no: 'BEO4PONRwangning', name: '亲子', priority: 12, url: 'http://3g.163.com/touch/article/list/BEO4PONRwangning/0-10.html'}
];

module.exports = function () {
    var currentObj = {};
    for (var i in wangyi_news_info_arr){
        currentObj = wangyi_news_info_arr[i];
        (function (obj) {
            NewsTypeModel.findOne({no: obj.no, name: obj.name}).exec(function (err, doc) {
                if (err) {
                    console.log('查询新闻类型错误, errMsg:' + err);
                    return;
                }
                if (!doc){
                    var newDoc = new NewsTypeModel(obj);
                    newDoc.save(function (err) {
                        if (err) {
                            console.log('保存新闻类型错误, errMsg:' + err);
                            return;
                        }
                        console.log('保存新闻类型' + obj.name + '成功');
                    });
                }
                console.log('新闻类型' + obj.name + '已经存在不在添加');
            });
        })(currentObj)
    }
}