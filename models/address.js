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

//省
var provincesSchema = new Schema({
    code: {type: String, require: true, index: 1},
    name: {type: String, require: true}
},{
    _id: true,
    id: true,
    collection: 'provinces'
});

//市
var citysSchema = new Schema({
    code: {type: String, require: true, index: 1},
    name: {type: String, require: true},
    parent_code: {type:String, require: true, index: 1}
},{
    _id: true,
    id: true,
    collection: 'citys'
});

//县
var countysSchema = new Schema({
    code: {type: String, require: true, index: 1},
    name: {type: String, require: true},
    parent_code: {type:String, require: true, index: 1}
},{
    _id: true,
    id: true,
    collection: 'countys'
});

//街道
var streetsSchema = new Schema({
    code: {type: String, require: true, index: 1},
    name: {type: String, require: true},
    parent_code: {type:String, require: true, index: 1}
},{
    _id: true,
    id: true,
    collection: 'streets'
});


//地址信息
var addressSchema = new Schema({
    province_code: {type: String},
    province_name: {type: String},
    city_code: {type: String},
    city_name: {type: String},
    county_code: {type: String},
    county_name: {type: String},
    street_code: {type: String},
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
};

//编译模型
var ProvincesModel = mongoose.model('ProvincesModel', provincesSchema);
var CitysModel = mongoose.model('CitysModel', citysSchema);
var CountysModel = mongoose.model('CountysModel', countysSchema);
var StreetsModel = mongoose.model('StreetsModel', streetsSchema);
var AddressModel = mongoose.model('AddressModel', addressSchema);

exports.AddressModel = AddressModel;
exports.ProvincesModel = ProvincesModel;
exports.CitysModel = CitysModel;
exports.CountysModel = CountysModel;
exports.StreetsModel = StreetsModel;
exports.addressSchema = addressSchema;
