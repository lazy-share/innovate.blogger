/**
 * Created by laizhiyuan on 2017/8/18.
 *
 * <p>
 * example route
 * </p>
 *
 */
var exampleService = require('../service/example');

module.exports = function(router){
    router.get('/example/updateByName', exampleService.updateByName);
    router.get('/example', exampleService.example);
    router.get('/example/findAll', exampleService.findAll);
    router.get('/example/likeByName', exampleService.likeByName);
    router.get('/example/findByOrder', exampleService.findByOrder);
    router.get('/example/deleteByName', exampleService.deleteByName);
    router.get('/example/findByLimit', exampleService.findByLimit);
    router.get('/example/testMethod', exampleService.testMethod);
    router.get('/example/testStaticMethod', exampleService.testStaticMethod);
    router.get('/example/testAggregate', exampleService.testAggregate);
    router.post('/example/insert', exampleService.insert);
    router.get('/example/index', exampleService.index);
};