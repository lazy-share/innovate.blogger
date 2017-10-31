/**
 * Created by lzy on 2017/10/26.
 */
var mongoose = require('mongoose');
var ArticlesModel = mongoose.model('ArticlesModel');
var NotesModel = mongoose.model('NotesModel');
var ImageModel = mongoose.model('ImageModel');
var AccountModel = mongoose.model('AccountModel');
var log = require('log4js').getLogger('home');
var result = require('../common/result');
var response = require('../common/response');

exports.articles = function (req, res) {
    var paging = req.query.paging;
    paging = JSON.parse(paging);
    ArticlesModel.find({is_private: false}).sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, articles) {
        if (err){
            log.error("home articles error:" + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        ArticlesModel.find({is_private: false}).count(function (err, count) {
            if (err){
                log.error("home articles error:" + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            var accIds = [];
            for (var i in articles){
                accIds.push(articles[i].account_id);
            }
            var obj = {articles: articles, count: count};
            if (accIds.length > 0){
                AccountModel.find({_id: {$in: accIds}}).exec(function (err, accs) {
                    if (err){
                        log.error("home articles error:" + err);
                        res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                        return;
                    }

                    for (var i = 0; i < articles.length; i++){
                        for (var j = 0; j < accs.length; j++){
                            if (String(accs[j]._id) == String(articles[i].account_id)){
                                articles[i].interspace_name = accs[j].interspace_name;
                                articles[i].head_portrait = accs[j].head_portrait;
                                break;
                            }
                        }
                    }
                    obj.articles = articles;
                    res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, obj));
                });
            }else {
                res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, obj));
            }
        });
    });
};

exports.notes = function (req, res) {
    var paging = req.query.paging;
    paging = JSON.parse(paging);
    NotesModel.find().sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, notes) {
        if (err){
            log.error("home notes error:" + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        NotesModel.find().count(function (err, count) {
            if (err){
                log.error("home notes error:" + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            var obj = {notes: notes, count: count};
            var accIds = [];
            for (var i in notes){
                accIds.push(notes[i].account_id);
            }
            if (accIds.length > 0){
                AccountModel.find({_id: {$in: accIds}}).exec(function (err, accs) {
                    if (err){
                        log.error("home notes error:" + err);
                        res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                        return;
                    }
                    for (var i in obj.notes){
                        for (var j in accs){
                            if (String(accs[j]._id) == String(obj.notes[i].account_id)){
                                obj.notes[i].interspace_name = accs[j].interspace_name;
                                obj.notes[i].head_portrait = accs[j].head_portrait;
                                break;
                            }
                        }
                    }
                    res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, obj));
                });
            }else {
                res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, obj));
            }
        });
    });
};

exports.images = function (req, res) {
    var paging = req.query.paging;
    if (paging){
        paging = JSON.parse(paging);
        ImageModel.find().count(function (err, count) {
            if (err){
                log.error("home images error:" + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            var queryOpt = {};
            //大于500的数据量是才舍弃30天以前的老数据
            if (count > 500){
                var nowTime = new Date();
                nowTime.setDate(nowTime.getDate() - 30); //当前时间前30天的数据
                queryOpt.update_time = {$lt: nowTime}; //只查询最近30天的数据
            }
            ImageModel.find(queryOpt).count(function (err, count) {
                if (err){
                    log.error("home images error:" + err);
                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                    return;
                }
                var queryOpt2 = {};
                var query = ImageModel.find(queryOpt2).sort({update_time: -1});
                //100以内不做随机skip,按时间倒序
                if (count < 100){
                    query.skip(paging.skip).limit(paging.limit);
                }else {
                    //大于100条数据时按时间倒序，再做随机skip
                    var maxSkip = (count - 9); //保证最大跳过能够把全部数据抓取完,因为一页10条
                    var randomSkip = maxSkip - 1;
                    var skip = Math.floor(Math.random() * randomSkip + 0);
                    paging.skip = skip;
                }
                query.skip(paging.skip).limit(paging.limit).exec(function (err, images) {
                    if (err){
                        log.error("home images error:" + err);
                        res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                        return;
                    }
                    var accIds = [];
                    for (var i in images){
                        accIds.push(images[i].account_id);
                    }
                    if (accIds.length > 0){
                        AccountModel.find({_id: {$in: accIds}}).exec(function (err, accs) {
                            if (err){
                                log.error("home images error:" + err);
                                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                                return;
                            }
                            for (var i in images){
                                for (var j in accs){
                                    if (String(accs[j]._id) == String(images[i].account_id)){
                                        images[i].interspace_name = accs[j].interspace_name;
                                        images[i].head_portrait = accs[j].head_portrait;
                                        break;
                                    }
                                }
                            }
                            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, images));
                        });
                    }else {
                        res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, images));
                    }
                });
            });
        });
    }
};