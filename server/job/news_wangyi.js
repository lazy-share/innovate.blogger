/**
 * Created by lzy on 2017/10/21.
 */
var http = require('http');
var mongoose = require('mongoose');
var NewsModel = mongoose.model('NewsModel');
const log = require('log4js').getLogger("news_wangyi");

/*
    推荐：http://3g.163.com/touch/article/list/BA8J7DG9wangning/20-20.html      主要修改20-20
    新闻：http://3g.163.com/touch/article/list/BBM54PGAwangning/0-10.html
    娱乐：http://3g.163.com/touch/article/list/BA10TA81wangning/0-10.html
    体育：http://3g.163.com/touch/article/list/BA8E6OEOwangning/0-10.html
    财经：http://3g.163.com/touch/article/list/BA8EE5GMwangning/0-10.html
    时尚：http://3g.163.com/touch/article/list/BA8F6ICNwangning/0-10.html
    军事：http://3g.163.com/touch/article/list/BAI67OGGwangning/0-10.html
    手机：http://3g.163.com/touch/article/list/BAI6I0O5wangning/0-10.html
    科技：http://3g.163.com/touch/article/list/BA8D4A3Rwangning/0-10.html
    游戏：http://3g.163.com/touch/article/list/BAI6RHDKwangning/0-10.html
    数码：http://3g.163.com/touch/article/list/BAI6JOD9wangning/0-10.html
    教育：http://3g.163.com/touch/article/list/BA8FF5PRwangning/0-10.html
    健康：http://3g.163.com/touch/article/list/BDC4QSV3wangning/0-10.html
    汽车：http://3g.163.com/touch/article/list/BA8DOPCSwangning/0-10.html
    家居：http://3g.163.com/touch/article/list/BAI6P3NDwangning/0-10.html
    房产：http://3g.163.com/touch/article/list/BAI6MTODwangning/0-10.html
    旅游：http://3g.163.com/touch/article/list/BEO4GINLwangning/0-10.html
    亲子：http://3g.163.com/touch/article/list/BEO4PONRwangning/0-10.html
*/
const wangyi_news_info_arr = [
    {no: 'BA8J7DG9wangning', name: '推荐', url: 'http://3g.163.com/touch/article/list/BA8J7DG9wangning/20-20.html'},
    {no: 'BBM54PGAwangning', name: '新闻', url: 'http://3g.163.com/touch/article/list/BBM54PGAwangning/0-10.html'},
    {no: 'BA10TA81wangning', name: '娱乐', url: 'http://3g.163.com/touch/article/list/BA10TA81wangning/0-10.html'},
    {no: 'BA8E6OEOwangning', name: '体育', url: 'http://3g.163.com/touch/article/list/BA8E6OEOwangning/0-10.html'},
    {no: 'BA8EE5GMwangning', name: '财经', url: 'http://3g.163.com/touch/article/list/BA8EE5GMwangning/0-10.html'},
    {no: 'BA8F6ICNwangning', name: '时尚', url: 'http://3g.163.com/touch/article/list/BA8F6ICNwangning/0-10.html'},
    {no: 'BAI67OGGwangning', name: '军事', url: 'http://3g.163.com/touch/article/list/BAI67OGGwangning/0-10.html'},
    {no: 'BAI6I0O5wangning', name: '手机', url: 'http://3g.163.com/touch/article/list/BAI6I0O5wangning/0-10.html'},
    {no: 'BA8D4A3Rwangning', name: '科技', url: 'http://3g.163.com/touch/article/list/BA8D4A3Rwangning/0-10.html'},
    {no: 'BAI6RHDKwangning', name: '游戏', url: 'http://3g.163.com/touch/article/list/BAI6RHDKwangning/0-10.html'},
    {no: 'BAI6JOD9wangning', name: '数码', url: 'http://3g.163.com/touch/article/list/BAI6JOD9wangning/0-10.html'},
    {no: 'BA8FF5PRwangning', name: '教育', url: 'http://3g.163.com/touch/article/list/BA8FF5PRwangning/0-10.html'},
    {no: 'BDC4QSV3wangning', name: '健康', url: 'http://3g.163.com/touch/article/list/BDC4QSV3wangning/0-10.html'},
    {no: 'BA8DOPCSwangning', name: '汽车', url: 'http://3g.163.com/touch/article/list/BA8DOPCSwangning/0-10.html'},
    {no: 'BAI6P3NDwangning', name: '家居', url: 'http://3g.163.com/touch/article/list/BAI6P3NDwangning/0-10.html'},
    {no: 'BAI6MTODwangning', name: '房产', url: 'http://3g.163.com/touch/article/list/BAI6MTODwangning/0-10.html'},
    {no: 'BEO4GINLwangning', name: '旅游', url: 'http://3g.163.com/touch/article/list/BEO4GINLwangning/0-10.html'},
    {no: 'BEO4PONRwangning', name: '亲子', url: 'http://3g.163.com/touch/article/list/BEO4PONRwangning/0-10.html'}
];

module.exports = function () {
    start();
    var interval = setInterval(start, 1000 * 60 * 30); //30分钟执行一次
    //start();
};

var addTotal = 0;
function start() {
    var nowTime = new Date();
    addTotal = 0;
    setTimeout(logAddTotal, 30000); //30s后执行
    log.info('============================ ' + nowTime + ' start request wangyi news ============================');
    for (var i = 0; i < wangyi_news_info_arr.length; i++){
        requestData(wangyi_news_info_arr[i]);
    }
}

function logAddTotal(){log.info('===============本次新增新闻数量:' + addTotal)}

function requestData(obj){
    http.get(obj.url,  function (res) {
        res.setEncoding('utf-8');
        var content = '';
        res.on('data', function (chunk) {
            content += chunk;
        });
        res.on('end', function () {
            content = content.slice(content.indexOf('{"' + obj.no), content.length -1);
            console.log('============================ start ' + obj.name + '======================================');
            var parseData = JSON.parse(content);
            saveToDatabase(parseData, obj);
            console.log('============================ end ' + obj.name + '======================================');
        });
        res.on("error", function (err) {
            console.log("请求" + obj.name + '新闻类型出错，信息如下：' + err);
        });
    });
}

function saveToDatabase(data, obj) {
    var newsArr = data[obj.no];
    var currentObj = {};
    for (var i in newsArr){
        currentObj = newsArr[i];
        currentObj.newsTypeName = obj.name;
        currentObj.newsTypeNo = obj.no;
        (function (obj) {
            NewsModel.findOne({docid: obj.docid, newsTypeNo: obj.newsTypeNo}).exec(function (err, doc) {
                if (err) {
                    log.error('查询网易新闻错误,新闻类型：' + obj.name + ' errMsg:' + err);
                    return;
                }
                if (!doc){
                    addTotal++;
                    var newDoc = new NewsModel(obj);
                    newDoc.save(function (err) {
                        if (err) {
                            log.error('保存网易新闻错误,新闻类型：' + obj.name + ' errMsg:' + err);
                            return;
                        }
                        log.info('新增新闻成功');
                    });
                }else {
                    log.info('已经存在,不做添加');
                }
            });
        })(currentObj)
    }
}

