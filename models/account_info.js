/**
 * Created by laizhiyuan on 2017/8/18.
 *
 * <p>
 *    账号信息Schema
 *  account info schema
 * </p>
 *
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var addressSchema = require('./address');

var accountInfoSchema = new Schema({
    account_id: {type: ObjectId},
    email:{type: String, required: false},
    birthday:{type: Date, required: false},
    gender:{type: Number, required: false, enum:[1, 2]},
    address: [addressSchema],
    photo_url: {type: String},
    job: {type: String},
    create_time: {type: Date, required: true, unique: false, default: Date.now()},
    update_time: {type: Date, required: true, unique: false, default: Date.now()}
},{
    collection: 'account_info'
});

accountInfoSchema.pre(['save','update'], function (next) {
    if (this.address == null){
        return next(new Error('address not empty!'));
    }
    next();
});

mongoose.model('AccountInfoModel', accountInfoSchema, false);
module.exports = accountInfoSchema;