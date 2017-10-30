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
var result = require('../common/result');
var response = require('../common/response');
var sysConnfig = require('../conf/sys_config');
var env = require("../conf/environments");
var log = require('log4js').getLogger('articleImage');
var fs = require("fs");

exports.delByDocId = function (docId, username) {
    log.info(username + docId);
    if (!username || !docId) {
        log.error('delByDocId param error');
        return;
    }
    ArticleImageModel.find({username: username, doc_id: docId}).exec(function (err, docs) {
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
        ArticleImageModel.remove({username: username, doc_id: docId}).exec(function (err) {
            if (err) {
                log.error('delByDocId  error');
                return;
            }
            log.info('delByDocId success' + username);
        });
    })
};

exports.setDocId = function (username, docId) {
    log.info(username + docId);
    if (!username || !docId) {
        log.error('setDocId param error');
        return;
    }
    ArticleImageModel.find({username: username, doc_id: null}).exec(function (err, docs) {
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

exports.deleteTempImagePath = function (username) {
    log.info(username);
    if (!username) {
        log.error('deleteTempImagePath param error');
        return;
    }
    ArticleImageModel.find({username: username, doc_id: null}).exec(function (err, docs) {
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
        ArticleImageModel.remove({username: username, doc_id: null}).exec(function (err) {
            if (err) {
                log.error('deleteTempImagePath remove error');
                return;
            }
            log.info('deleteTempImagePath success' + username);
        });
    });
};

exports.addTempImagePath = function (username, path) {
    log.info(username + path);
    if (!username || !path) {
        log.error('addTempImagePath param error');
        return;
    }
    var nowTime = new Date();
    var newDoc = new ArticleImageModel({
        username: username,
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
        log.info('addTempImagePath success:' + path + '@' + username);
    });
};