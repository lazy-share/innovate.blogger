/**
 * Created by lzy on 2017/8/1.
 *
 * mongodb config
 */
var SysConfig = {};
var DB = {};
var USER_ADMIN = {};
var DB_ADMIN = {};

/*当前项目数据库配置*/
DB.ip = '127.0.0.1';
DB.port = '27017';
DB.database = 'blogger';
DB.username = 'lzy';
DB.password = '123456';

/*用户管理员账号*/
USER_ADMIN.username = 'useradmin';
USER_ADMIN.password = '123456';

/*数据库管理员账号*/
DB_ADMIN.username = 'dbadmin';
DB_ADMIN.password = '123456';

SysConfig.DB = DB;
SysConfig.UA = USER_ADMIN;
SysConfig.DA = DB_ADMIN;

module.exports = SysConfig;