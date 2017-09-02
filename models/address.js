/**
 * Created by laizhiyuan on 2017/8/18.
 *
 * <p>
 *      地址Schema
 *  address schema
 * </p>
 *
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var addressSchema = new Schema({
    province_code: {type: Number},
    province_name: {type: String},
    city_code: {type: Number},
    city_name: {type: String},
    county_code: {type: Number},
    county_name: {type: String},
    street_code: {type: Number},
    street_name: {type: String},
    details: {type: String}
},{
    _id: false
});

//地址完整信息
addressSchema.method.fullInfo = function () {
    return this.province_name + ' ' +
            this.city_name + ' ' +
            this.county_name + ' ' +
            this.street_name + ' ' +
            this.details;
}

//编译模型
var AddressModel = mongoose.model('AddressModel', addressSchema);
exports.AddressModel = AddressModel;
exports.addressSchema = addressSchema;
