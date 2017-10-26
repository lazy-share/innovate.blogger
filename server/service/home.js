/**
 * Created by lzy on 2017/10/26.
 */
var mongoose = require('mongoose');
var ArticlesModel = mongoose.model('ArticlesModel');
var NotesModel = mongoose.model('NotesModel');
var log = require('log4js').getLogger('home');
var result = require('../common/result');
var response = require('../common/response');

exports.articles = function (req, res) {
    var paging = req.query.paging;
    paging = JSON.parse(paging);
    ArticlesModel.find().sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, articles) {
        if (err){
            log.error("home articles error:" + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        ArticlesModel.find().count(function (err, count) {
            if (err){
                log.error("home articles error:" + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            var obj = {articles: articles, count: count};
            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, obj));
        });
    });
};

exports.notes = function (req, res) {
    var paging = req.query.paging;
    paging = JSON.parse(paging);
    NotesModel.find().sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, notes) {
        if (err){
            log.error("home articles error:" + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        NotesModel.find().count(function (err, count) {
            if (err){
                log.error("home articles error:" + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            var obj = {notes: notes, count: count};
            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, obj));
        });
    });
};