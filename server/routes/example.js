/**
 * Created by laizhiyuan on 2017/8/18.
 *
 * <p>
 * example route
 * </p>
 *
 */
var exampleService = require('./example');

module.exports = function(app){
    app.get('/example/updateByName', exampleService.updateByName);
    app.get('/example', exampleService.example);
    app.get('/example/findAll', exampleService.findAll);
    app.get('/example/likeByName', exampleService.likeByName);
    app.get('/example/findByOrder', exampleService.findByOrder);
    app.get('/example/deleteByName', exampleService.deleteByName);
    app.get('/example/findByLimit', exampleService.findByLimit);
    app.get('/example/testMethod', exampleService.testMethod);
    app.get('/example/testStaticMethod', exampleService.testStaticMethod);
    app.get('/example/testAggregate', exampleService.testAggregate);
    app.post('/example/insert', exampleService.insert);
    app.get('/example/index', exampleService.index);
};