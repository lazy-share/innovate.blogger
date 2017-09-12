/**
 * Created by laizhiyuan on 2017/9/11.
 *
 * <p>
 *    账号信息
 * </p>
 *
 */
var accountInfoApp = angular.module('accountInfoApp', []);

accountInfoApp.service('accountInfoService', ['$http', function () {
    this.uid = $('#uid').val();
    this.validateAccountInfoForm = function () {

        //检测手机号是否正确
        $.validator.addMethod("isMobile", function(value, element) {
            var length = value.length;
            var regPhone = /^1([3578]\d|4[57])\d{8}$/;
            return this.optional(element) || ( length == 11 && regPhone.test( value ) );
        }, "请正确填写您的手机号码");

        //检测用户姓名是否为汉字
        $.validator.addMethod("isChar", function(value, element) {
            var length = value.length;
            var regName = /[^\u4e00-\u9fa5]/g;
            return this.optional(element) || !regName.test( value );
        }, "目前该字段不支持汉字)");

        $('#accountInfoForm').validate({
            rules:{
                email:{
                    email:true
                },
                mobile:{
                    isMobile: true
                }
            },
            messages: {
                email:{
                    email: '请输入正确格式的电子邮件'
                },
                mobile:{
                    isMobile: '请输入合法格式手机号码'
                }
            },
            submitHandler: function () {
                return false;
            },
            errorClass: "validateError"
        });
    };

    this.initDatePlus = function () {
        $('.datetimepicker').datetimepicker({
            format: "yyyy-mm-dd",
            autoclose: true,
            todayBtn: true,
            language:'zh-CN'
        });
    }
}]);

accountInfoApp.controller('accountInfoController', ['$scope', '$http','accountInfoService',
    '$window', '$filter', function ($scope, $http, accountInfoService, $window, $filter) {
    $scope.uid = accountInfoService.uid;
    accountInfoService.validateAccountInfoForm();
    accountInfoService.initDatePlus();
    $scope.disable = true;
    $scope.showCity = false;
    $scope.showCounty = false;
    $scope.showStreet = false;
    $scope.provinces = [{name: '--请选择省--', code: ''}];
    $scope.citys = [{name: '--请选择市--', code: ''}];
    $scope.countys = [{name: '--请选择县--', code: ''}];
    $scope.streets = [{name: '--请选择街道--', code: ''}];
    $scope.genders = [{name:'--请选择--',value: ''},{name: '男', value: 1}, {name: '女', value: 2}];
    $scope.educations = [{name:'--请选择--', value: ''},{name:'中专/高中', value: 1},{name:'大专', value: 2},{name:'本科', value: 3}
    ,{name:'研究生', value: 4},{name:'博士', value: 5},{name:'博士后', value: 6},{name:'其它', value: 7}];
    $scope.doSearch = function () {
        if ($scope.uid){
            $http({
                url: '/accountInfo/details/' + $scope.uid,
                method: 'get'
            }).then(function success(res) {
                if (res.data.code){
                    $scope.showErrorMsg = false;
                    $scope.accountInfo = res.data.data;
                    if ($scope.accountInfo.birthday){
                        $scope.accountInfo.birthday = $filter('date')($scope.accountInfo.birthday,'yyyy-MM-dd')
                    }
                    if (!($scope.accountInfo.gender)){
                        $scope.accountInfo.gender = $scope.genders[0].value;
                    }
                    if (!($scope.accountInfo.education)){
                        $scope.accountInfo.education = $scope.educations[0].value;
                    }
                    $scope.loadAllProvinces();
                }else {
                    $scope.showErrorMsg = true;
                    $scope.errorMsg = res.data.msg;
                }
            }, function error(res) {
                $scope.showErrorMsg = true;
                $scope.errorMsg = '服务器错误!';
                //console.log(res.statusCode);
            });
        }
    };

    $scope.loadAllProvinces = function (isChange) {
        $http({
            url: '/address/findAllProvinces',
            method: 'get'
        }).then(function success(res) {
            if (res.data.code){
                var provincesData = res.data.data;
                $scope.provinces = $scope.provinces.concat(provincesData);
                if (isChange){

                }else {

                }
                if (!$scope.accountInfo.address.province_code){
                    $scope.accountInfo.address.province_code = $scope.provinces[0].code;
                }else {
                    $scope.accountInfo.address.city_code = '';
                    $scope.loadCitysByProinceCode();
                }
            }
        }, function error(res) {
            $scope.showErrorMsg = true;
            $scope.errorMsg = '服务器错误!';
        });
    };
    $scope.loadCitysByProinceCode = function () {
        if ($scope.accountInfo.address.province_code){
            $scope.showCity = true;
            $http({
                url: '/address/findCitysByProinceCode/' + $scope.accountInfo.address.province_code,
                method: 'get'
            }).then(function success(res) {
                if (res.data.code){
                    var citysData = res.data.data;
                    $scope.citys = $scope.citys.concat(citysData);
                    if (!$scope.accountInfo.address.city_code){
                        $scope.accountInfo.address.city_code = $scope.citys[0].code;
                    }else {
                        $scope.accountInfo.address.county_code = '';
                        $scope.loadCountysByCityCode();
                    }
                }
            }, function error(res) {
                $scope.showErrorMsg = true;
                $scope.errorMsg = '服务器错误!';
            });
        }else {
            $scope.showCity = false;
            $scope.accountInfo.address.city_code = $scope.citys[0].code;
        }
    };
    $scope.loadCountysByCityCode = function () {
        if ($scope.accountInfo.address.city_code){
            $scope.showCounty = true;
            $http({
                url: '/address/findCountysByCityCode/' + $scope.accountInfo.address.city_code,
                method: 'get'
            }).then(function success(res) {
                if (res.data.code){
                    var countysData = res.data.data;
                    $scope.countys = $scope.countys.concat(countysData);
                    if (!$scope.accountInfo.address.county_code){
                        $scope.accountInfo.address.county_code = $scope.countys[0].code;
                    }else {
                        $scope.accountInfo.address.street_code = '';
                        $scope.loadStreetsByCountyCode();
                    }
                }
            }, function error(res) {
                $scope.showErrorMsg = true;
                $scope.errorMsg = '服务器错误!';
            });
        }else {
            $scope.showCounty = false;
            $scope.accountInfo.address.county_code = $scope.countys[0].code;
        }
    };
    $scope.loadStreetsByCountyCode = function () {
        if ($scope.accountInfo.address.county_code){
            $scope.showStreet = true;
            $http({
                url: '/address/findStreetsByCountyCode/' +$scope.accountInfo.address.county_code ,
                method: 'get'
            }).then(function success(res) {
                if (res.data.code){
                    var streetsData = res.data.data;
                    $scope.streets = $scope.streets.concat(streetsData);
                    if (!$scope.accountInfo.address.street_code){
                        $scope.accountInfo.address.street_code = $scope.streets[0].code;
                    }
                }
            }, function error(res) {
                $scope.showErrorMsg = true;
                $scope.errorMsg = '服务器错误!';
            });
        }else {
            $scope.showStreet = false;
            $scope.accountInfo.address.street_code = $scope.streets[0].code;
        }
    };

    $scope.doSearch();

    $scope.changeHeadPortrait = function () {
        if ($scope.disable){
            $scope.showErrorMsg = true;
            $scope.errorMsg = '服务器错误!';
        }
    };

    $scope.edit = function () {
        $scope.disable = false;
    };

    $scope.confirmEdit = function () {
        $http({
            url: '/accountInfo/update',
            method: 'post',
            data: {accountInfo: $scope.accountInfo}
        }).then(function success(res) {
            if (res.data.code){
                $window.location.href = "/accountInfo/index/" + accountInfoService.uid;
            }else {
                $scope.showErrorMsg = true;
                $scope.errorMsg = '服务器错误!';
            }
        }, function error(res) {
            $scope.showErrorMsg = true;
            $scope.errorMsg = '服务器错误!';
        });
    }
}]);
