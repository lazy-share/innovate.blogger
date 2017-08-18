/**
 * Created by laizhiyuan on 2017/8/3.
 *
 * <p>
 *      账号Schema
 *   account schema
 * </p>
 *
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var accountSchema = new Schema({
    username:{type: String, index: 1, unique: true, required: true},
    password:{type: String, required: true},
    status:{type: Number, requered: true, default: 1, enum:[1,2,3]},
    create_time:{type: Date, required: true, unique:false, default:Date.now()},
    update_time:{type: Date, requered: true, unique:false, default:Date.now()}
},{
    autoIndex: true,
    id: true,
    _id: true,
    safe: true,
    strict: true,
    collection: 'account'
});

console.log('Required Paths:' + accountSchema.requiredPaths(true));
console.log('Indexes: ' + accountSchema.indexes());
mongoose.model('AccountModel', accountSchema, false);
module.exports = accountSchema;