/**
 * Created by lzy on 2017/9/23.
 */
var sysConfig = {
  dev: {
      dbIp: '127.0.0.1',
      dbPort: '27017',
      dbDatabase: 'blogger',
      dbUsername: 'laizhiyuan',
      dbPwd: '123456',
      dbUserAdminUsername: 'useradmin',
      dbUserAdminPwd: '123456',
      dbDbAdminUsername: 'dbadmin',
      dbDbAdminPwd: '123456',
      jwtSecret:'laizhiyuan666',
      redisIP:'127.0.0.1',
      redisPort: '6379'
  },
    test: {
        dbIp: '127.0.0.1',
        dbPort: '27017',
        dbDatabase: 'blogger',
        dbUsername: 'laizhiyuan',
        dbPwd: '123456',
        dbUserAdminUsername: 'useradmin',
        dbUserAdminPwd: '123456',
        dbDbAdminUsername: 'dbadmin',
        dbDbAdminPwd: '123456',
        jwtSecret:'laizhiyuan666',
        redisIP:'127.0.0.1',
        redisPort: '6379'
    },
    pro: {
        dbIp: '127.0.0.1',
        dbPort: '27017',
        dbDatabase: 'blogger',
        dbUsername: 'laizhiyuan',
        dbPwd: '123456',
        dbUserAdminUsername: 'useradmin',
        dbUserAdminPwd: '123456',
        dbDbAdminUsername: 'dbadmin',
        dbDbAdminPwd: '123456',
        jwtSecret:'laizhiyuan666',
        redisIP:'127.0.0.1',
        redisPort: '6379'
    }
};
module.exports = sysConfig;