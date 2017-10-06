/**
 * Created by lzy on 2017/9/2.
 *
 * <p>
 *     账号详细信息 Schema
 * </p>
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var addressSchema = require('./address');
var relationshipSchema = require('./relationship').relationshipSchema;
var dateSchema = require('./date');

var accountInfoSchema = new Schema({
    username: {type: String, required: true, unique: true}, //关联账号
    email:{type: String, required: false}, //邮箱
    birthday:{type: dateSchema, required: false}, //生日
    gender:{type: Number, required: false, enum:[1, 2]}, //性别 [男，女]
    address: {type: addressSchema}, //地址
    head_portrait: {type: String}, //头像url
    job: {type: String}, //职业
    qq: {type: String}, //QQ
    mobile: {type: String}, //手机
    education: {type: Number, required: false, enum:[1, 2, 3, 4, 5, 6,7]}, //学历[中专/高中,大专，本科，研究生，博士，博士后，其它]
    motto: {type: String}, //座右铭
    wechat: {type: String}, //微信
    visitor: {type: [relationshipSchema], required: false}, //访问量
    attention: {type: [relationshipSchema], required: false}, //关注
    fans: {type: [relationshipSchema], required: false} //粉丝
},{
    autoIndex: true,
    id: true, //id获取器
    _id: true, //自动生成_id
    safe: true, //更新时应用一个写入关注
    strict: true,
    collection: 'account_info'
});

accountInfoSchema.index({username: 1});
accountInfoSchema.set('versionKey', '_account_info');

var AccountInfoModel = mongoose.model('AccountInfoModel', accountInfoSchema, false);
exports.accountInfoSchema = accountInfoSchema;
exports.AccountInfoModel = AccountInfoModel;