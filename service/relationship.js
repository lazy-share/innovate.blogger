/**
 * Created by laizhiyuan on 2017/9/13.
 *
 * <p>
 *     往来关系服务层
 * </p>
 *
 */
var RelationshipModel = require('../models/relationship').RelationshipModel;


//关注username
exports.findFansByUsername = function (username) {
    RelationshipModel.find({subject: username, type: 1}).exec();
};

//username的关注
exports.findAttentionByUsername = function (username) {
    RelationshipModel.find({from: username, type: 1}).exec();
};

//查找一个
exports.findOneType1 = function (subject, from) {
    RelationshipModel.findOne({subject: subject,type:1, from: from}).exec();
};

