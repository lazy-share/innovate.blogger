/**
 * Created by lzy on 2017/9/11.
 */
var env = require('../conf/environments');
var sysConf = require('../conf/sys_config')[env];
var mongoose = require('mongoose');
var ProvincesModel = mongoose.model('ProvincesModel');
var CitysModel = mongoose.model('CitysModel');
var CountysModel = mongoose.model('CountysModel');
var StreetsModel = mongoose.model('StreetsModel');
var provinceArr, cityArr, countyArr, streetArr;
provinceArr = require('./provinces');
cityArr = require('./cities');
countyArr = require('./areas');
streetArr = require('./streets');

module.exports = function () {
    initProvinces();
    initCitys();
    initStreets();
    initAreas();
};

//初始化省
function initProvinces() {
    var currentObj = {};
    for (var i in provinceArr){
        currentObj = provinceArr[i];
        (function (obj) {
            ProvincesModel.findOne({code: obj.code}).exec(function (err, doc) {
                if (doc){
                    console.log(doc.name + "已经存在，不做添加");
                    return;
                }
                var newDoc = new ProvincesModel(obj);
                newDoc.save(function (err) {
                    if (err) {
                        console.log("保存" + obj.name + "错误:" + err);
                    }else {
                        console.log("保存" + obj.name + "成功");
                    }
                });
            });
        })(currentObj)
    }
}

//初始化市
function initCitys() {
    var currentObj = {};
    for (var i in cityArr){
        currentObj = cityArr[i];
        (function (obj) {
            CitysModel.findOne({code: obj.code}).exec(function (err, doc) {
                if (doc){
                    console.log(doc.name + "已经存在，不做添加");
                    return;
                }
                var newDoc = new CitysModel(obj);
                newDoc.save(function (err) {
                    if (err) {
                        console.log("保存" + obj.name + "错误:" + err);
                    }else {
                        console.log("保存" + obj.name + "成功");
                    }
                });
            });
        })(currentObj)
    }
}

//初始化县
function initAreas() {
    var currentObj = {};
    for (var i in countyArr){
        currentObj = countyArr[i];
        (function (obj) {
            CountysModel.findOne({code: obj.code}).exec(function (err, doc) {
                if (doc){
                    console.log(doc.name + "已经存在，不做添加");
                    return;
                }
                var newDoc = new CountysModel(obj);
                newDoc.save(function (err) {
                    if (err) {
                        console.log("保存" + obj.name + "错误:" + err);
                    }else {
                        console.log("保存" + obj.name + "成功");
                    }
                });
            });
        })(currentObj)
    }
}
//初始化街道
function initStreets(db) {
    var currentObj = {};
    for (var i in streetArr){
        currentObj = streetArr[i];
        (function (obj) {
            StreetsModel.findOne({code: obj.code}).exec(function (err, doc) {
                if (doc){
                    console.log(doc.name + "已经存在，不做添加");
                    return;
                }
                var newDoc = new StreetsModel(obj);
                newDoc.save(function (err) {
                    if (err) {
                        console.log("保存" + obj.name + "错误:" + err);
                    }else {
                        console.log("保存" + obj.name + "成功");
                    }
                });
            });
        })(currentObj)
    }
}