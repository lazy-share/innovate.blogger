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
      jwtValidity: 60 * 30, // 开发设置为30分钟 没有时间单位以秒为准 其它格式"2 days" "3h" "1y"
      redisOpts:{},
      webRootUri: '/v1/api/web',
      thisDoman: 'http://127.0.0.1:3000',
      upload_root_dir: process.cwd() + '/server',
      upload_media_dir: '/public/web/medias',
      upload_header_dir:  '/public/web/images/header',
      upload_article_dir:  '/public/web/images/article',
      static_path: '/public/web',
      Access_Control_Allow_Origin: 'http://127.0.0.1:4200'
  },
    prod: {
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
        jwtValidity: 60 * 30, // 开发设置为30分钟 没有时间单位以秒为准 其它格式"2 days" "3h" "1y"
        redisOpts:{},
        webRootUri: '/v1/api/web',
        thisDoman: 'http://47.94.226.67',
        upload_root_dir: process.cwd(),
        upload_media_dir:  '/public/web/medias',
        upload_header_dir: '/public/web/images/header',
        upload_article_dir: '/public/web/images/article',
        static_path:'/public/web',
        Access_Control_Allow_Origin:'http://47.94.226.67'
    }
};
module.exports = sysConfig;