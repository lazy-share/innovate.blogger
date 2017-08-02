/**
 * Created by lzy on 2017/8/1.
 *
 * system config
 */
var SysConfig = {};
var DB = {};

/*mongodb数据库配置*/
DB.ip = '127.0.0.1';
DB.port = '27017';
DB.database = 'blogger';
DB.username = 'lzy';
DB.password = '123456';

SysConfig.DB = DB;

module.exports = SysConfig;
