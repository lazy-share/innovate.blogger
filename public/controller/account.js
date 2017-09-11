/**
 * Created by laizhiyuan on 2017/9/11.
 *
 * <p>
 *   账号angular模块
 * </p>
 *
 */
//忘记密码模块
var forgetApp = angular.module('forgetApp', []);
forgetApp.service('forgetService', function(){
    this.init = function () {
        $('#validateEncryptedForm').validate({
            rules: {
                username: {
                    required: true,
                    minlength: 5,
                    maxlength: 25
                },
                encrypted: {
                    required: true,
                    minlength: 6
                }
            },
            messages: {
                username: {
                    required: '请输入5-25位字符',
                    minlength: '至少5位以上',
                    maxlength: '长度不能大于25'
                },
                encrypted: {
                    required: '注册时的密保码',
                    minlength: '至少6位以上'
                }
            },
            submitHandler: function () {
                return false;
            },
            errorClass: "validateError"
        });
        $('#updatePwdForm').validate({
            rules: {
                password: {
                    required: true,
                    minlength: 6
                },
                confirmPassword: {
                    required: true,
                    minlength: 6,
                    equalTo: "#password"
                }
            },
            messages: {
                password: {
                    required: '请输入6位以上的密码',
                    minlength: '至少6位以上'
                },
                confirmPassword: {
                    required: '请输入6位以上的密码',
                    minlength: '至少6位以上',
                    equalTo: "两次密码不一致"
                }
            },
            submitHandler: function () {
                return false;
            },
            errorClass: "validateError"
        })
    };
});
forgetApp.controller('forgetController', ['$scope', '$http', 'forgetService','$window', function ($scope, $http, forgetService, $window) {
    forgetService.init();
    $scope.validateCode = false;
    $scope.encryptValidate = function () {
        var validateEncryptedFormValid = $('#validateEncryptedForm').valid();
        if (validateEncryptedFormValid){
            $http({
                url: '/account/encryptValidate',
                method: 'post',
                data: {forget: $scope.forget}
            }).then(function success(res) {
                if (res.data.code){
                    $scope.validateCode = true;
                    $scope.showErrorMsg = false;
                }else {
                    $scope.forgetMsg = res.data.msg;
                    $scope.showErrorMsg = true;
                }
            }, function error(res) {
                $scope.forgetMsg = '服务器错误!';
                $scope.showErrorMsg = true;
                //console.log(res.status);
            });
        }
    };
    $scope.updatePwd = function () {
        var updatePwdFormValidate = $('#updatePwdForm').valid();
        if (updatePwdFormValidate){
            $http({
                url: '/account/updatePwd',
                method: 'post',
                data: {forget: $scope.forget}
            }).then(function success(res) {
                if (res.data.code){
                    $window.location.href = '/account/forget/success';
                }else {
                    $scope.forgetMsg = res.data.msg;
                    $scope.showErrorMsg = true;
                }
            }, function error(res) {
                $scope.forgetMsg = '服务器错误!';
                $scope.showErrorMsg = true;
                console.log(res.status);
            });
        }
    }
}]);


//注册模块
var registerApp = angular.module('registerApp', []);
registerApp.service('registerService', function(){
    this.init = function () {
        $('#registerForm').validate({
            rules: {
                username: {
                    required: true,
                    minlength: 5,
                    maxlength: 25
                },
                password: {
                    required: true,
                    minlength: 6
                },
                confirmPassword: {
                    required: true,
                    minlength: 6,
                    equalTo: "#password"
                },
                encrypted: {
                    required: true,
                    minlength:6
                }
            },
            messages: {
                username: {
                    required: '请输入5-25位字符',
                    minlength: '至少5位以上',
                    maxlength: '长度不能大于25'
                },
                password: {
                    required: '请输入6位以上的密码',
                    minlength: '至少6位以上'
                },
                confirmPassword: {
                    required: '请输入6位以上的密码',
                    minlength: '至少6位以上',
                    equalTo: "两次密码不一致"
                },
                encrypted: {
                    required: '找回密码时关键字符串',
                    minlength: '至少6位字符串以上'
                }
            },
            submitHandler: function () {
                return false;
            },
            errorClass: "validateError"
        })
    };
});
registerApp.controller('validateRegister', ['$scope', '$http','$window', 'registerService', function ($scope, $http, $window,  registerService) {
    registerService.init();
    $scope.register = function () {
        var registerFormIsValid = $('#registerForm').valid();
        if (registerFormIsValid) {
            $http({
                url: '/account/registerValidate',
                method: 'post',
                data: {username: $scope.account.username}
            }).then(function success(res) {
                if (res.data.code){
                    $http({
                        url: '/account/register',
                        method: 'post',
                        data: {account: $scope.account}
                    }).then(function success(res) {
                        if (res.data.code){
                            $window.location.href = '/account/register/success';
                        }else {
                            $scope.registerCode = res.data.code;
                            $scope.registerMsg = res.data.msg;
                        }
                    }, function error(res) {
                        $scope.registerMsg = '服务器错误!';
                        $scope.showErrorMsg = true;
                        // console.log(res.status);
                    });
                }else{
                    $scope.accountValidate = res.data.msg;
                    $scope.code = res.data.code;
                }
            }, function error(res) {
                $scope.registerMsg = '服务器错误!';
                $scope.showErrorMsg = true;
                //console.log(res.status);
            });
        }
    }
}]);
