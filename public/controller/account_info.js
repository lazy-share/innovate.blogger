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
    this.validateUpdateHeadForm = function () {
        $('#updateHeadForm').validate({
            rules: {
                upload: {
                    required: true
                }
            },
            messages: {
                upload: {
                    required: '请选择头像'
                }
            },
            submitHandler: function (form) {
                $(form).ajaxSubmit({
                    type:form.method,
                    url: form.action
                });
                return false;
            },
            errorClass: "validateError"
        });
    }
    this.validateAccountInfoForm = function () {
        //检测手机号是否正确
        $.validator.addMethod("isMobile", function (value, element) {
            var length = value.length;
            var regPhone = /^1([3578]\d|4[57])\d{8}$/;
            return this.optional(element) || ( length == 11 && regPhone.test(value) );
        }, "请正确填写您的手机号码");

        $('#accountInfoForm').validate({
            rules: {
                email: {
                    email: true
                },
                mobile: {
                    isMobile: true
                }
            },
            messages: {
                email: {
                    email: '请输入正确格式的电子邮件'
                },
                mobile: {
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
            language: 'zh-CN'
        });
    }

    this.openUploadHead = function () {
        $('#upateHeadModal').modal('show', true);
    }

    this.currentUid = $('#currentUid').val();
}]);

accountInfoApp.controller('accountInfoController', ['$scope', '$http', 'accountInfoService',
    '$window', '$filter', function ($scope, $http, accountInfoService, $window, $filter) {
        $scope.uid = accountInfoService.uid;
        $scope.currentUid = accountInfoService.currentUid;
        accountInfoService.validateAccountInfoForm();
        accountInfoService.initDatePlus();
        accountInfoService.validateUpdateHeadForm();
        $scope.showConcern = true;
        $scope.disable = true;
        $scope.showCity = false;
        $scope.showCounty = false;
        $scope.showStreet = false;
        $scope.provinces = [{name: '--请选择省--', code: ''}];
        $scope.genders = [{name: '--请选择--', value: ''}, {name: '男', value: 1}, {name: '女', value: 2}];
        $scope.educations = [{name: '--请选择--', value: ''}, {name: '中专/高中', value: 1}, {
            name: '大专',
            value: 2
        }, {name: '本科', value: 3}
            , {name: '研究生', value: 4}, {name: '博士', value: 5}, {name: '博士后', value: 6}, {name: '其它', value: 7}];
        $scope.doSearch = function () {
            if ($scope.uid) {
                $http({
                    url: '/accountInfo/details/' + $scope.uid,
                    method: 'get'
                }).then(function success(res) {
                    if (res.data.code) {
                        $scope.showErrorMsg = false;
                        $scope.accountInfo = res.data.data;
                        //判断和初始化默认生日、性别、学历、头像、关注、粉丝等个人信息
                        if ($scope.accountInfo.birthday) {
                            $scope.accountInfo.birthday = $filter('date')($scope.accountInfo.birthday, 'yyyy-MM-dd')
                        }
                        if (!($scope.accountInfo.gender)) {
                            $scope.accountInfo.gender = $scope.genders[0].value;
                        }
                        if (!($scope.accountInfo.education)) {
                            $scope.accountInfo.education = $scope.educations[0].value;
                        }
                        if (!($scope.accountInfo.head_portrait)) {
                            $scope.accountInfo.head_portrait = '/images/notHead.jpg';
                        }
                        for (var index in $scope.accountInfo.fans){
                            if ($scope.accountInfo.fans[index] == $scope.currentUid){
                                $scope.showConcern = false;
                                break;
                            }
                        }
                        $scope.loadAllProvinces();
                    } else {
                        if (res.data.data === -1){
                            $window.location.href = '/account/notAccount';
                            return;
                        }
                        alert(res.data.msg);
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
        $scope.loadAllProvinces = function () {
            $http({
                url: '/address/findAllProvinces',
                method: 'get'
            }).then(function success(res) {
                if (res.data.code) {
                    var provincesData = res.data.data;
                    $scope.provinces = $scope.provinces.concat(provincesData);
                    if (!$scope.accountInfo.address.province_code) {
                        $scope.accountInfo.address.province_code = $scope.provinces[0].code;
                        $scope.showCity = false;
                        $scope.showCounty = false;
                        $scope.showStreet = false;
                        $scope.accountInfo.address.city_code = '';
                        $scope.accountInfo.address.county_code = '';
                        $scope.accountInfo.address.street_code = '';
                    } else {
                        $scope.loadCitysByProinceCode(false);
                    }
                }
            }, function error(res) {
                $scope.showErrorMsg = true;
                $scope.errorMsg = '服务器错误!';
            });
        };
        $scope.loadCitysByProinceCode = function (isChange) {
            if (isChange) {
                if (!$scope.accountInfo.address.province_code) {
                    $scope.showCity = false;
                    $scope.showCounty = false;
                    $scope.showStreet = false;
                    $scope.accountInfo.address.city_code = '';
                    $scope.accountInfo.address.county_code = '';
                    $scope.accountInfo.address.street_code = '';
                    return;
                }
            }
            $scope.showCity = true;
            $http({
                url: '/address/findCitysByProinceCode/' + $scope.accountInfo.address.province_code,
                method: 'get'
            }).then(function success(res) {
                if (res.data.code) {
                    $scope.citys = res.data.data;
                    if (isChange || !$scope.accountInfo.address.city_code) {
                        if (!$scope.citys[0]) {
                            $scope.showCity = false;
                            $scope.showCounty = false;
                            $scope.showStreet = false;
                            $scope.accountInfo.address.city_code = '';
                            $scope.accountInfo.address.county_code = '';
                            $scope.accountInfo.address.street_code = '';
                            return;
                        }
                        $scope.accountInfo.address.city_code = $scope.citys[0].code;
                    }
                    $scope.loadCountysByCityCode(isChange);
                } else {
                    $scope.showCity = false;
                    $scope.showCounty = false;
                    $scope.showStreet = false;
                    $scope.accountInfo.address.city_code = '';
                    $scope.accountInfo.address.county_code = '';
                    $scope.accountInfo.address.street_code = '';
                }
            }, function error(res) {
                $scope.showErrorMsg = true;
                $scope.errorMsg = '服务器错误!';
            });
        };
        $scope.loadCountysByCityCode = function (isChange) {
            $scope.showCounty = true;
            $http({
                url: '/address/findCountysByCityCode/' + $scope.accountInfo.address.city_code,
                method: 'get'
            }).then(function success(res) {
                if (res.data.code) {
                    $scope.countys = res.data.data;
                    if (isChange || !$scope.accountInfo.address.county_code) {
                        if (!$scope.countys[0]) {
                            $scope.showCounty = false;
                            $scope.showStreet = false;
                            $scope.accountInfo.address.county_code = '';
                            $scope.accountInfo.address.street_code = '';
                            return;
                        }
                        $scope.accountInfo.address.county_code = $scope.countys[0].code;
                    }
                    $scope.loadStreetsByCountyCode(isChange);
                } else {
                    $scope.showCounty = false;
                    $scope.showStreet = false;
                    $scope.accountInfo.address.county_code = '';
                    $scope.accountInfo.address.street_code = '';
                }
            }, function error(res) {
                $scope.showErrorMsg = true;
                $scope.errorMsg = '服务器错误!';
            });
        };
        $scope.loadStreetsByCountyCode = function (isChange) {
            $scope.showStreet = true;
            $http({
                url: '/address/findStreetsByCountyCode/' + $scope.accountInfo.address.county_code,
                method: 'get'
            }).then(function success(res) {
                if (res.data.code) {
                    var streetsData = res.data.data;
                    $scope.streets = streetsData;
                    if (isChange || !$scope.accountInfo.address.street_code) {
                        if (!$scope.streets[0]) {
                            $scope.showStreet = false;
                            $scope.accountInfo.address.street_code = '';
                            return;
                        }
                        $scope.accountInfo.address.street_code = $scope.streets[0].code;
                    }
                } else {
                    $scope.showStreet = false;
                    $scope.accountInfo.address.street_code = '';
                }
            }, function error(res) {
                $scope.showErrorMsg = true;
                $scope.errorMsg = '服务器错误!';
            });
        };

        $scope.doSearch();

        //修改头像
        $scope.changeHeadPortrait = function () {
            accountInfoService.openUploadHead();
        };

        //编辑个人信息
        $scope.edit = function () {
            $scope.disable = false;
        };

        //保存个人信息
        $scope.confirmEdit = function () {
            $http({
                url: '/accountInfo/update',
                method: 'post',
                data: {accountInfo: $scope.accountInfo}
            }).then(function success(res) {
                if (res.data.code) {
                    $window.location.href = "/accountInfo/index/" + accountInfoService.uid;
                } else {
                    $scope.showErrorMsg = true;
                    $scope.errorMsg = '服务器错误!';
                }
            }, function error(res) {
                $scope.showErrorMsg = true;
                $scope.errorMsg = '服务器错误!';
            });
        };

        //关注他
        $scope.concern = function () {
            $http({
                url: '/accountInfo/concern/' + $scope.accountInfo.username,
                method: 'get'
            }).then(function success(res) {
                if (res.data.code){
                    $scope.accountInfo.fans = res.data.data;
                    $scope.showConcern = false;
                }else {
                    if (res.data.data == -1){
                        $window.location.href = '/account/login';
                    }else {
                        $scope.showErrorMsg = true;
                        $scope.errorMsg = res.data.msg;
                    }
                }
            }, function error(res) {
                $scope.showErrorMsg = true;
                $scope.errorMsg = '服务器错误!';
            });
        };

        //取消关注
        $scope.cancleConcern = function () {
            $http({
                url: '/accountInfo/cancleConcern/' + $scope.accountInfo.username,
                method: 'get'
            }).then(function success(res) {
                if (res.data.code){
                    $scope.accountInfo.fans = res.data.data;
                    $scope.showConcern = true;
                }else {
                    if (res.data.data == -1){
                        $window.location.href = '/account/login';
                    }else {
                        $scope.showErrorMsg = true;
                        $scope.errorMsg = res.data.msg;
                    }
                }
            }, function error(res) {
                $scope.showErrorMsg = true;
                $scope.errorMsg = '服务器错误!';
            });
        }
    }]);
