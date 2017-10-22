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
      redisIP:'127.0.0.1',
      redisPort: '6379',
      redisOpts:{},
      webRootUri: '/v1/api/web',
      thisDoman: 'http://127.0.0.1:3000',
      upload_media_dir: '/public/web/medias',
      upload_header_dir: '/public/web/images/header',
      upload_article_dir: '/public/web/images/article',
      server_project_name: '/server',
      static_path:'/public/web'
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
        jwtValidity: 60 * 30, // 开发设置为30分钟 没有时间单位以秒为准 其它格式"2 days" "3h" "1y"
        redisIP:'127.0.0.1',
        redisPort: '6379',
        redisOpts:{},
        webRootUri: '/v1/api/web',
        thisDoman: 'http://127.0.0.1:3000',
        upload_media_dir: '/public/web/medias',
        upload_header_dir: '/public/web/images/header',
        upload_article_dir: '/public/web/images/article',
        server_project_name: '/server'
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
        redisIP:'127.0.0.1',
        redisPort: '6379',
        redisOpts:{},
        webRootUri: '/server/v1/api/web',
        thisDoman: 'www.laizhiyuan.xin/server',
        upload_media_dir: '/public/web/medias',
        upload_header_dir: '/public/web/images/header',
        upload_article_dir: '/public/web/images/article',
        server_project_name: '/server',
        static_path:'/server/public/web'
    }
};
module.exports = sysConfig;