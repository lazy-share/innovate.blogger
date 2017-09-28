/**
 * Created by laizhiyuan on 2017/9/12.
 *
 * <p>
 *    地址路由
 * </p>
 *
 */
var addressService = require('../service/address');

module.exports = function (router) {
    router.get('/address/findAllProvinces', addressService.findAllProvinces);
    router.get('/address/findCitysByProinceCode/:code', addressService.findCitysByProinceCode);
    router.get('/address/findCountysByCityCode/:code', addressService.findCountysByCityCode);
    router.get('/address/findStreetsByCountyCode/:code', addressService.findStreetsByCountyCode);
};