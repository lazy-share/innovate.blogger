/**
 * Created by laizhiyuan on 2017/9/12.
 *
 * <p>
 *    地址路由
 * </p>
 *
 */
var addressService = require('./address');

module.exports = function (app) {
    app.get('/address/findAllProvinces', addressService.findAllProvinces);
    app.get('/address/findCitysByProinceCode/:code', addressService.findCitysByProinceCode);
    app.get('/address/findCountysByCityCode/:code', addressService.findCountysByCityCode);
    app.get('/address/findStreetsByCountyCode/:code', addressService.findStreetsByCountyCode);
};