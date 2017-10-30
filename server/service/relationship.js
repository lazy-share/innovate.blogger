/**
 * Created by lzy on 2017/10/29.
 */
var mongoose = require('mongoose');
var RelationshipModel = mongoose.model('RelationshipModel');
var result = require('../common/result');
var response = require('../common/response');
var log = require('log4js').getLogger('relation');
var RELATION = require('../common/relation_enum');

/**
 * 添加赞
 * @param subject
 * @param from
 * @param doc_id
 * @param doc_type
 */
exports.addPraiseRelation = function (subject, from, doc_id, doc_type) {
    if (!subject || !from || !doc_type || !doc_id){
        log.error('addPraiseRelation param error');
        return;
    }
    var nowTime = new Date();
    var newRelation = new RelationshipModel({
        type: RELATION.type.PRAISE,
        subject: subject,
        from: from,
        doc_id: doc_id,
        doc_type:doc_type,
        update_time: nowTime,
        create_time: nowTime
    });
    newRelation.save(function (err) {
        if (err){
            log.error('addPraiseRelation error:' + err);
            return;
        }
    });
};

//添加评论
exports.addCommentRelation = function (subject, from, doc_id, doc_type) {
    log.info(subject + from + doc_id + doc_type);
    if (!subject || !from || !doc_type || !doc_id){
        log.error('addCommentRelation param error');
        return;
    }
    var nowTime = new Date();
    var newRelation = new RelationshipModel({
        type: RELATION.type.COMMENT,
        subject: subject,
        from: from,
        doc_id: doc_id,
        doc_type:doc_type,
        update_time: nowTime,
        create_time: nowTime
    });
    newRelation.save(function (err) {
        if (err){
            log.error('addCommentRelation error:' + err);
            return;
        }
    });
};

//删除赞
exports.deletePraiseRelation = function (subject, from, doc_id, doc_type) {
    log.info(subject + from + doc_id + doc_type);
    if (!subject || !from || !doc_type || !doc_id){
        log.error('deletePraiseRelation param error');
        return;
    }
    var queryOpt = {subject:subject, from: from, doc_id: doc_id, doc_type: doc_type, type: RELATION.type.PRAISE};
    RelationshipModel.findOne(queryOpt).exec(function (err, rel) {
        if (err) {
            log.error('deletePraiseRelation error:' + err);
            return;
        }
        if (!rel){
            log.info('deletePraiseRelation 查无数据');
            return;
        }
        rel.remove(function (err) {
            if (err){
                log.error('deletePraiseRelation error:' + err);
                return;
            }
        });
    });
};

//删除评论
exports.deleteCommentRelation = function (subject, from, doc_id, doc_type) {
    log.info(subject + from + doc_id + doc_type);
    if (!subject || !from || !doc_type || !doc_id){
        log.error('deleteCommentRelation param error');
        return;
    }
    var queryOpt = {subject:subject, from: from, doc_id: doc_id, doc_type: doc_type, type: RELATION.type.COMMENT};
    RelationshipModel.findOne(queryOpt).exec(function (err, rel) {
        if (err) {
            log.error('deleteCommentRelation error:' + err);
            return;
        }
        if (!rel){
            log.info('deleteCommentRelation 查无数据');
            return;
        }
        rel.remove(function (err) {
            if (err){
                log.error('deleteCommentRelation error:' + err);
                return;
            }
        });
    });
};

//删除文章或说说时，删除对应的动态记录
exports.deletePraiseAndCommentByDeleteDoc = function(docId, docType){
    log.info('docId:' + docId + '| docType:' + docType);
    if (docId && docType){
        RelationshipModel.remove({doc_id: docId, type: {$in: [RELATION.type.PRAISE, RELATION.type.COMMENT]}, doc_type: docType}).exec(function (err) {
            if (err) {
                log.error('deletePraiseAndCommentByDeleteDoc' + err);
            }
        });
    }
}

//与我相关列表(赞、评论、关注我的、访问我的)
exports.praiseAndCommentRelations = function (req, res) {
    var account_id = req.query.account_id;
    RelationshipModel.find({subject: account_id, type: {$in: [RELATION.type.PRAISE, RELATION.type.COMMENT, RELATION.type.VISITOR, RELATION.type.ATTENTION]}, is_view: false}).exec(function (err, relations) {
        if (err) {
            log.error('praiseAndCommentRelations error, errMsg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, relations));
    });
};

//与我相关列表(赞、评论、关注我的、访问我的)
exports.praiseAndCommentRelationCount = function (req, res) {
    var account_id = req.query.account_id;
    RelationshipModel.find({subject: account_id, type: {$in: [RELATION.type.PRAISE, RELATION.type.COMMENT, RELATION.type.VISITOR, RELATION.type.ATTENTION]}, is_view: false}).count(function (err, count) {
        if (err) {
            log.error('praiseAndCommentRelations error, errMsg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }

        res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, count));
    });
};

exports.deleteRelation = function (req, res) {
    var id = req.query.id;
    var type = req.query.type;
    log.info(id + type);
    if (!id ||　!type){
        log.error('deleteRelation param error');
        return;
    }
    if (type == RELATION.type.VISITOR || type == RELATION.type.ATTENTION){
        RelationshipModel.update({_id: id},{is_view: {$set: true}}).exec(function (err) {
            if (err){
                log.error('deleteRelation err:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, null));
        });
    }else {
        RelationshipModel.remove({_id: id}).exec(function (err) {
            if (err){
                log.error('deleteRelation err:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, null));
        });
    }

};
