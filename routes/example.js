/**
 * Created by laizhiyuan on 2017/8/18.
 *
 * <p>
 * example route
 * </p>
 *
 */
var exampleService = require('../service/example');

module.exports = function(app){
    app.get('/updateByName', exampleService.updateByName);
    app.get('/example', exampleService.example);
    app.get('/findAll', exampleService.findAll);
    app.get('/likeByName', exampleService.likeByName);
    app.get('/findByOrder', exampleService.findByOrder);
    app.get('/deleteByName', exampleService.deleteByName);
    app.get('/findByLimit', exampleService.findByLimit);
    app.get('/testMethod', exampleService.testMethod);
    app.get('/testStaticMethod', exampleService.testStaticMethod);
    app.get('/testAggregate', exampleService.testAggregate);
    app.get('/insert', exampleService.insert);
};