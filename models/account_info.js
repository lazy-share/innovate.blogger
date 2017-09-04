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

var accountInfoSchema = new Schema({
    account_id: {type: String, required: true, unique: true},
    email:{type: String, required: false},
    birthday:{type: Date, required: false},
    gender:{type: Number, required: false, enum:[1, 2]},
    address: [addressSchema],
    photo_url: {type: String},
    job: {type: String},
    encrypted: {type: String, required: true},
    qq: {type: String},
    mobile: {type: String}
},{
    autoIndex: true,
    id: false, //id获取器
    _id: false, //自动生成_id
    safe: true, //更新是应用一个写入关注
    strict: true,
    collection: 'account_info'
});

accountInfoSchema.index({account_id: 1});
accountInfoSchema.set('versionKey', '_account_info');
//mongoose 中间件
accountInfoSchema.schema.pre('save', function (next) {
    if (this.address == null){
        console.log('address is null');
    }
    next();
});

var AccountInfoModel = mongoose.model('AccountInfoModel', accountInfoSchema, false);
exports.accountInfoSchema = accountInfoSchema;
exports.AccountInfoModel = AccountInfoModel;