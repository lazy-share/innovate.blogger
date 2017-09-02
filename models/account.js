/**
 * Created by laizhiyuan on 2017/8/3.
 *
 * <p>
 *      账号Schema
 * </p>
 *
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var accountSchema = new Schema({
    username:{type: String, index: 1, unique: true, required: true},
    password:{type: String, required: true},
    status:{type: Number, required: true, default: 1, enum:[1,2,3]},
    create_time:{type: Date, required: true, unique:false, default:Date.now()},
    update_time:{type: Date, required: true, unique:false, default:Date.now()}
},{
    autoIndex: true,
    id: false, //id获取器
    _id: false, //自动生成_id
    safe: true, //更新是应用一个写入关注
    strict: true, //不保存没有在该模型定义的属性
    collection: 'account'
});

accountSchema.set('versionKey', '_account');
console.log('Required Paths:' + accountSchema.requiredPaths(true));
console.log('Indexes: ' + accountSchema.indexes());
var AccountModel = mongoose.model('AccountModel', accountSchema, false);

exports.AccountModel = AccountModel;
exports.accountSchema = accountSchema;