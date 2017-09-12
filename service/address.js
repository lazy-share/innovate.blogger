/**
 * Created by laizhiyuan on 2017/9/12.
 *
 * <p>
 *    地址服务层
 * </p>
 *
 */
var address = require('../models/address');
var ProvincesModel = address.ProvincesModel;
var CitysModel = address.CitysModel;
var CountysModel = address.CountysModel;
var StreetsModel = address.StreetsModel;

//查所有省
exports.findAllProvinces = function (req, res) {
    ProvincesModel.find().exec(function (err, docs) {
        if (err){
            console.log('查询省错误，errMsg:' + err);
            res.json({code: false, msg: '系统错误!'});
            return;
        }
        if (!docs){
            res.json({code: false, msg: '查无数据!'});
            return;
        }
        res.json({code: true, msg: '查询成功!', data: docs});
    });
};

//查询对应省所有的市
exports.findCitysByProinceCode = function (req, res) {
    var provinceCode = req.params.code;
    if (!provinceCode){
        res.json({code: false, msg: '参数错误!'});
        return;
    }
    CitysModel.find({parent_code: '' + provinceCode})
        .exec(function (err, docs) {
            if (err){
                console.log('查询市错误，errMsg:' + err);
                res.json({code: false, msg: '系统错误!'});
                return;
            }
            if (!docs){
                res.json({code: false, msg: '查无数据!'});
                return;
            }
            res.json({code: true, msg: '查询成功!', data: docs});
        });
};

//查询对应市所有的县
exports.findCountysByCityCode = function (req, res) {
    var cityCode = req.params.code;
    if (!cityCode){
        res.json({code: false, msg: '参数错误!'});
        return;
    }
    CountysModel.find({parent_code: '' + cityCode})
        .exec(function (err, docs) {
            if (err){
                console.log('查询县错误，errMsg:' + err);
                res.json({code: false, msg: '系统错误!'});
                return;
            }
            if (!docs){
                res.json({code: false, msg: '查无数据!'});
                return;
            }
            res.json({code: true, msg: '查询成功!', data: docs});
        });
};

//查询对应县所有的街道
exports.findStreetsByCountyCode = function (req, res) {
    var streetCode = req.params.code;
    if (!streetCode){
        res.json({code: false, msg: '参数错误!'});
        return;
    }
    StreetsModel.find({parent_code: '' + streetCode})
        .exec(function (err, docs) {
            if (err){
                console.log('查询街道错误，errMsg:' + err);
                res.json({code: false, msg: '系统错误!'});
                return;
            }
            if (!docs){
                res.json({code: false, msg: '查无数据!'});
                return;
            }
            res.json({code: true, msg: '查询成功!', data: docs});
        });
};