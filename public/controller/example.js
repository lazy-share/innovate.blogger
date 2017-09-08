/**
 * Created by lzy on 2017/9/7.
 */
//模块exampleApp
var myApp2 = angular.module('myApp2', [])
    .controller('controllerA', ['$scope', function ($scope) {
        $scope.message = 'this is controllerA message';
    }])
    .controller('controllerB', ['$scope', function ($scope) {
        $scope.message = 'this is controllerB message';
    }])
    .controller('controllerC', ['$scope', function ($scope) {
        $scope.name = 'laizhiyuan';
    }])
    .directive('directiveA', function () {
        return {
            template: "<h1>自定义指令!</h1>"
        }
    })
    .directive('directiveB', ['$interval', '$filter', '$log', function ($interval, $filter, $log) {
        return {
            /*compile: function () {
             return {
             pre: function (scope) {
             console.log('compile directive pre');
             }
             }
             },*/
            restrict: 'EACM',
            link: function (scope, element, attrs) {
                scope.timeFormat = 'yyyy-MM-dd HH:mm:ss';
                var timeFormat, timeoutId;
                function updateTime() {
                    element.text($filter('date')(new Date(), timeFormat));
                }
                
                scope.$watch(attrs.myFormat, function (value) {
                    timeFormat = value;
                    updateTime();
                });

                element.on('$destroy', function () {
                    $interval.cancel(timeoutId);
                });

                timeoutId = $interval(function () {
                    updateTime();
                }, 1000);
            }
        }
    }])
    .controller('controllerD', ['$scope', function ($scope) {
        $scope.name = 'laizhiyuan';
        $scope.sayHello = function () {
            $scope.message = 'Hello ' + $scope.name;
        }
    }])
    .controller('controllerE', ['$scope', '$rootScope', function ($scope, $rootScope) {
        $scope.books = ['java', 'node', 'go'];
        $rootScope.title = 'Test rootScope';
    }])
    .controller('testfilter',['$scope' , function ($scope) {
        $scope.firstname = 'LAI';
        $scope.lastname = 'zhiyuan';
        $scope.arr = [{
            id: 1,
            name: 'zhangsan'
        },{
            id:5,
            name: 'lisi'
        },{
            id:9,
            name: 'wangwu'
        },{
            id: 16,
            name: 'chenglili'
        }];
    }])
    .filter('myFilter', function () {
        return function (text) {
            return 'No' + text;
        }
    })
    .controller('testservice', ['$scope', '$location','$http', function ($scope, $location, $http) {
        $scope.myUrl = $location.absUrl();
        $http.get('/example/findAll').then(function (res) {
            $scope.exampleData = res.data;
        })
    }]).service('myService', function () {
        this.join = function (arr, split) {
            console.log("invoke myService, split:" + split);
            return arr.join(split);
        }
        this.toArr = function (str, split) {
            return str.split(split);
        }
    })
    .controller('testMyService', ['$scope','myService', function ($scope, myService) {
        var arr = [1,2,34,55,66,88,12];
        $scope.len = arr.length;
        $scope.data = myService.join(arr, ',');
        $scope.$watch('data', function () {
            arr = myService.toArr($scope.data, ',');
            $scope.len = arr.length;
        })
    }])
    .controller('testHttp', ['$scope','$http', function ($scope, $http) {
        $scope.example = {};
        $scope.addExample = function () {
            console.log("invoke addExample, example:" +  $scope.example);
            $http({
                method: 'post',
                data: $scope.example,
                url: '/example/insert'
            }).then(function success(response) {
                $scope.msg = response.data.msg;
            }, function error(response) {
                $scope.msg = response.data.msg;
            });
        }
    }]);
