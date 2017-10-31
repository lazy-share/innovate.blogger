/**
 * Created by laizhiyuan on 2017/10/30.
 *
 * <p>
 *
 * </p>
 *
 */
var mongoose = require('mongoose');
var ArticleImageModel = mongoose.model('ArticleImageModel');
var AccountModel = mongoose.model('AccountModel');
var result = require('../common/result');
var response = require('../common/response');
var log = require('log4js').getLogger('articleImage');
var fs = require("fs");

exports.delByDocId = function (docId, account_id) {
    log.info(account_id + docId);
    if (!account_id || !docId) {
        log.error('delByDocId param error');
        return;
    }
    ArticleImageModel.find({account_id: account_id, doc_id: docId}).exec(function (err, docs) {
        if (err) {
            log.error('delByDocId  error');
            return;
        }
        for (var i in docs) {
            (function (path) {
                if (fs.existsSync(path)) {
                    fs.unlink(path, function (err) {
                        if (err) {
                            log.error('delByDocId error, É¾³ýÎÄ¼þ´íÎó' + err);
                            return;
                        }
                    });
                }
            })(docs[i].image_path)
        }
        ArticleImageModel.remove({account_id: account_id, doc_id: docId}).exec(function (err) {
            if (err) {
                log.error('delByDocId  error');
                return;
            }
            log.info('delByDocId success' + account_id);
        });
    })
};

exports.setDocId = function (account_id, docId) {
    log.info(account_id + docId);
    if (!account_id || !docId) {
        log.error('setDocId param error');
        return;
    }
    ArticleImageModel.find({account_id: account_id, doc_id: null}).exec(function (err, docs) {
        if (err) {
            log.error('setDocId update error');
            return;
        }
        for (var i in docs){
            (function (doc, doc_id) {
                doc.doc_id = doc_id;
                doc.save(function (err) {
                    if (err){
                        log.error('update doc_id error:' + err);
                    }
                });
            })(docs[i], docId)
        }
    });
};

exports.deleteTempImagePath = function (account_id) {
    log.info(account_id);
    if (!account_id) {
        log.error('deleteTempImagePath param error');
        return;
    }
    ArticleImageModel.find({account_id: account_id, doc_id: null}).exec(function (err, docs) {
        if (err) {
            log.error('deleteTempImagePath error');
            return;
        }
        for (var i in docs) {
            (function (path) {
                if (fs.existsSync(path)) {
                    fs.unlink(path, function (err) {
                        if (err) {
                            log.error('delByDocId error, É¾³ýÎÄ¼þ´íÎó' + err);
                            return;
                        }
                    });
                }
            })(docs[i].image_path)
        }
        ArticleImageModel.remove({account_id: account_id, doc_id: null}).exec(function (err) {
            if (err) {
                log.error('deleteTempImagePath remove error');
                return;
            }
            log.info('deleteTempImagePath success' + account_id);
        });
    });
};

exports.addTempImagePath = function (account_id, path) {
    log.info(account_id + path);
    if (!account_id || !path) {
        log.error('addTempImagePath param error');
        return;
    }
    var nowTime = new Date();
    var newDoc = new ArticleImageModel({
        account_id: account_id,
        image_path: path,
        doc_id: null,
        update_time: nowTime,
        create_time: nowTime
    });
    newDoc.save(function (err) {
        if (err) {
            log.error('addTempImagePath error:' + err);
            return;
        }
        log.info('addTempImagePath success:' + path + '@' + account_id);
    });
};