/**
 * Created by laizhiyuan on 2017/9/12.
 *
 * <p>
 *    地址路由
 * </p>
 *
 */
var addressService = require('../service/address');
const env = require('../conf/environments');
const webRootApi = (require('../conf/sys_config')[env]).webRootUri;

module.exports = function (router) {
    router.get(webRootApi + '/private/address/provinces', addressService.findAllProvinces);
    router.get(webRootApi + '/private/address/citys', addressService.findCitysByProinceCode);
    router.get(webRootApi + '/private/address/countys', addressService.findCountysByCityCode);
    router.get(webRootApi + '/private/address/streets', addressService.findStreetsByCountyCode);
};