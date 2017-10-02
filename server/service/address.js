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

var result = require('../common/result');
var response = require('../common/response');
var log = require('log4js').getLogger('address');

//查所有省
exports.findAllProvinces = function (req, res) {
    log.info("==================findAllProvinces======================");
    ProvincesModel.find().exec(function (err, docs) {
        if (err) {
            console.log('查询省错误，errMsg:' + err);
            log.error('findAllProvinces err! msg:' + err);
            res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
            return;
        }
        if (!docs) {
            log.error('findAllProvinces 查无数据');
            res.json(result.json(response.C605.status, response.C605.code, response.C605.msg, null));
            return;
        }
        res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, docs));
    });
};

//查询对应省所有的市
exports.findCitysByProinceCode = function (req, res) {
    var provinceCode = req.query.provinceCode;
    log.info("==================findCitysByProinceCode, params " + provinceCode);
    if (!provinceCode) {
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, docs));
        return;
    }
    CitysModel.find({parent_code: '' + provinceCode})
        .exec(function (err, docs) {
            if (err) {
                console.log('查询市错误，errMsg:' + err);
                log.error('findCitysByProinceCode err! msg:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            if (!docs) {
                log.error('findCitysByProinceCode 查无数据');
                res.json(result.json(response.C605.status, response.C605.code, response.C605.msg, null));
                return;
            }
            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, docs));
        });
};

//查询对应市所有的县
exports.findCountysByCityCode = function (req, res) {
    var cityCode = req.query.cityCode;
    log.info("==================findCitysByProinceCode, params " + cityCode);
    if (!cityCode) {
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, docs));
        return;
    }
    CountysModel.find({parent_code: '' + cityCode})
        .exec(function (err, docs) {
            if (err) {
                console.log('查询县错误，errMsg:' + err);
                log.error('findCountysByCityCode err! msg:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            if (!docs) {
                log.error('findCountysByCityCode 查无数据');
                res.json(result.json(response.C605.status, response.C605.code, response.C605.msg, null));
                return;
            }
            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, docs));
        });
};

//查询对应县所有的街道
exports.findStreetsByCountyCode = function (req, res) {
    var countyCode = req.query.countyCode;
    log.info("==================findStreetsByCountyCode, params " + countyCode);
    if (!countyCode) {
        res.json(result.json(response.C601.status, response.C601.code, response.C601.msg, null));
        return;
    }
    StreetsModel.find({parent_code: '' + countyCode})
        .exec(function (err, docs) {
            if (err) {
                console.log('查询街道错误，errMsg:' + err);
                log.error('findStreetsByCountyCode err! msg:' + err);
                res.json(result.json(response.C500.status, response.C500.code, response.C500.msg, null));
                return;
            }
            if (!docs) {
                log.error('findStreetsByCountyCode 查无数据');
                res.json(result.json(response.C605.status, response.C605.code, response.C605.msg, null));
                return;
            }
            res.json(result.json(response.C200.status, response.C200.code, response.C200.msg, docs));
        });
};