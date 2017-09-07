/**
 * Created by lzy on 2017/9/7.
 */
//模块exampleApp
var myApp1 = angular.module('myApp1', [])
    .config(function ($provide, $filterProvider) {
        $provide.value('currentTime', new Date());
        $filterProvider.register('helloFilter', function(time){
            console.log("current date is :" + time);
        });
    }).run(function ($rootScope, currentTime, helloFilter) {
        $rootScope.testRootScope = 'this is test rootScope';
        currentTime = new Date();
        helloFilter(currentTime);
    });
myApp1.value('msg1', 'this is test msg1').constant('testConstant', 'laige');
myApp1.controller('controllerA', ['$scope', 'msg1', '$rootScope', function ($scope, msg, $rootScope) {
    $scope.message =  msg;
    $rootScope.testRootScope = 'this is test rootScope';
    $scope.$digest();
}]);

//模块myApp
var myApp2 = angular.module('myApp2', ['myApp1']);
myApp2.value('msg2', 'this is test msg2');
myApp2.controller('controllerB', ['$scope', 'msg2', function ($scope, msg) {
    $scope.message = msg;
}]);
