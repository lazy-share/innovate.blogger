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
    interspace_name: {type:String, required: false},
    head_portrait: {type: String},
    password:{type: String, required: true},
    status:{type: Number, required: true, default: 1, enum:[1,2,3]}, //状态
    encrypted: {type: String, required: true},
    token: {type: String, required: false},
    create_time:{type: Date, required: true, unique:false, default:Date.now()},
    update_time:{type: Date, required: true, unique:false, default:Date.now()},
    last_login_time: {type: Date, required: false, unique: false},
    current_login_time:{type: Date, required: false, unique: false}
},{
    autoIndex: true,
    id: true, //id获取器
    _id: true, //自动生成_id
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