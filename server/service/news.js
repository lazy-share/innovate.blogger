/**
 * Created by lzy on 2017/10/21.
 */
var mongoose = require('mongoose');
var NewsModel = mongoose.model('NewsModel');
var NewsTypeModel = mongoose.model('NewsTypeModel');
var result = require('../common/result');
var response = require('../common/response');
var log = require('log4js').getLogger('news');

exports.newsTypes = function (req, res) {
    log.info('===============enter newsTypes================');
    NewsTypeModel.find({is_use: true}).sort({priority: 1}).exec(function (err, types) {
        if (err) {
            log.error('newsTypes error: errMsg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, types));
    });
};

exports.news = function (req, res) {
    log.info('===============enter news================');
    var paging = req.query.paging;
    var type = req.query.type;
    if (!type){
        log.error('news params error, type is empty or null');
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    paging = JSON.parse(paging);
    NewsModel.find({newsTypeNo: type}).sort({ptime: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, news) {
        if (err) {
            log.error('news error: errMsg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        NewsModel.find({newsTypeNo: type}).count(function (err, count) {
            if (err) {
                log.error('news error: errMsg:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            var obj = {news: news, count: count};
            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, obj));
        })
    });
};

