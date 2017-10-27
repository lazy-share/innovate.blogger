/**
 * Created by laizhiyuan on 2017/10/20.
 *
 * <p>
 *
 * </p>
 *
 */
var mongoose = require('mongoose');
var MediaModel = mongoose.model('MediaModel');
var result = require('../common/result');
var response = require('../common/response');
var log = require('log4js').getLogger('media');
var sysConnfig = require('../conf/sys_config');
var env = require("../conf/environments");
var fs = require("fs");

/**
 * 删除媒体
 * @param req
 * @param res
 */
exports.delMedia = function (req, res) {
    var id = req.query.id;
    var username = req.query.username;
    if (!id || !username){
        log.error('delMedia error, params is null or empty' + username + id);
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    MediaModel.findOne({_id: id}).exec(function (err, media) {
        if (err) {
            log.error('delMedia error, errMsg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        if (!media){
            log.error('delMedia error, 媒体查无数据');
            res.json(result.json(response.C605.status, response.C605.code, response.C605.msg, null));
            return;
        }
        var startIndex = media.media_url.lastIndexOf('/');
        var mediaFileName = media.media_url.slice(startIndex + 1, media.media_url.length);
        var uploadMediaDir = sysConnfig[env].upload_root_dir + sysConnfig[env].upload_media_dir;
        var mediaFilePath = uploadMediaDir + '/' + mediaFileName;
        if (mediaFilePath.indexOf('\\') > -1){
            mediaFilePath = mediaFilePath.replace(/\\/g, '/');
        }
        if( fs.existsSync(mediaFilePath) ) {
            fs.unlink(mediaFilePath, function (err) {
                if (err){
                    log.error('delMedia error, 删除文件错误' + err);
                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                    return;
                }
                media.remove(function (err) {
                    if (err){
                        log.error('delMedia error, 删除文件后删除数据库数据错误' + err);
                        res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                        return;
                    }
                    var paging = req.query.paging;
                    paging = JSON.parse(paging);
                    MediaModel.find({username: username}).sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, medias) {
                        if (err) {
                            log.error('delMedia error, errMsg:' + err);
                            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                            return;
                        }
                        MediaModel.find({username: username}).count(function (err, count) {
                            if (err) {
                                log.error('delMedia error, errMsg:' + err);
                                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                                return;
                            }
                            var obj = {medias: medias, count: count};
                            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, obj));
                        });
                    });
                });
            });

        }else{
            res.json(result.json(response.C609.status, response.C609.code, response.C609.msg, null));
        }
    });
};

/**
 * 媒体列表
 * @param req
 * @param res
 */
exports.medias = function (req, res) {
    var username = req.query.username;
    if (!username){
        log.error('medias error, params is null or empty' + username);
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    var paging = req.query.paging;
    paging = JSON.parse(paging);
    MediaModel.find({username: username}).sort({update_time: -1}).skip(paging.skip).limit(paging.limit).exec(function (err, medias) {
        if (err) {
            log.error('medias error, errMsg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        MediaModel.find({username: username}).count(function (err, count) {
            if (err) {
                log.error('medias error, errMsg:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            var obj = {medias: medias, count: count};
            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, obj));
        });
    });
};

/**
 * 上传媒体
 * @param req
 * @param res
 */
exports.upload = function (req, res) {
    var username = req.params.username;
    var skip = req.params.skip;
    var limit = req.params.limit;
    log.info("====================enter upload media, params: " + username + '|' + skip + '|' + limit);
    if (username) {
        var multiparty = require('multiparty');
        var util = require('util');
        //生成multiparty对象，并配置上传目标路径
        var form = new multiparty.Form({uploadDir: sysConnfig[env].upload_root_dir + sysConnfig[env].upload_media_dir});
        //上传完成后处理
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.log('upload media, error: ' + err);
                log.error("upload media, error: " + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            } else {
                var inputFile = files.uploadfile[0];
                log.info(username + " 成功上传媒体：" + inputFile.path);
                var oldFilePath = inputFile.path;
               /* var arr = oldFilePath.split('\.');
                if (!(arr instanceof Array) || arr.length != 2 || arr[i] != 'mp4'){
                    res.json(result.json(response.C610.status, response.C610.code, response.C610.msg, null));
                    return;
                }*/
                if (oldFilePath.indexOf('\\') > -1) {
                    oldFilePath = oldFilePath.replace(/\\/g, '/');
                }
                var startIndex = oldFilePath.indexOf(sysConnfig[env].upload_media_dir);
                var filePath = oldFilePath.substring(startIndex, oldFilePath.length);
                filePath = sysConnfig[env].thisDoman + filePath;
                var nowTime = new Date();
                var mediaModel = new MediaModel({
                    username: username,
                    media_url: filePath,
                    create_time: nowTime,
                    update_time: nowTime
                });
                mediaModel.save(function (err) {
                    if (err) {
                        console.log("upload media error: errMsg:" + err);
                        log.error("upload media error: " + err);
                        res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                        return;
                    }

                        MediaModel.find({username: username}).sort({update_time: -1}).skip(parseInt(skip)).limit(parseInt(limit)).exec(function (err, medias) {
                            if (err) {
                                console.log("upload media after select error: errMsg:" + err);
                                log.error("upload media after select error: " + err);
                                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                                return;
                            }
                            MediaModel.find({username: username}).count(function (err, count) {
                                if (err) {
                                    log.error('upload media after select error, errMsg:' + err);
                                    res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                                    return;
                                }
                                var obj = {medias: medias, count: count};
                                res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, obj));
                            });
                        })
                    });
            }
        });
    } else {
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
};