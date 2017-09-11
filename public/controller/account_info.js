/**
 * Created by laizhiyuan on 2017/9/11.
 *
 * <p>
 *    账号信息
 * </p>
 *
 */
var accountInfoApp = angular.module('accountInfoApp', []);
accountInfoApp.service('accountInfoService', function () {
   this.uid = $('#uid').val();
});
accountInfoApp.controller('accountInfoController', ['$scope', '$http','accountInfoService', function ($scope, $http, accountInfoService) {
    $scope.uid = accountInfoService.uid;
    $scope.doSelect = function () {
        if ($scope.uid){
            $http({
                url: '/accountInfo/details/' + $scope.uid,
                method: 'get'
            }).then(function success(res) {
                if (res.data.code){
                    console.log(res.data.data);
                    $scope.accountInfo = res.data.data;
                    $scope.showErrorMsg = false;
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
    $scope.doSelect();
}]);
