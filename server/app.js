const express = require('express');
const app = express();
const path = require('path');
const url = require('url');
const bodyParser = require('body-parser');
const log4js = require('log4js');
const env = require('./conf/environments');
const sysConf = require('./conf/sys_config')[env];

const appInit = require('./init/app_init');
appInit.initLog4js(app);
appInit.initMongoDb();
const routers = express.Router();
const modelPath = path.join(__dirname, 'models');
const routerPath = path.join(__dirname, 'routers');
appInit.initModels(modelPath);
require('./job/news_wangyi')();
//require('./db_script/article-type-script').initSysDefaultArticleType();
//require('./db_script/address-script')();
//require('./db_script/news-type-script')();

//配置中间件
const appFilter = require('./filter/app_filter');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(sysConf.static_path, express.static(path.join(__dirname, '/public/web')));
app.use(bodyParser({uploadDir: sysConf.default_upload_dir}));
app.all('*', appFilter.crossDomain);
app.use(appFilter.security);
app.all(/^\/v1\/api\/web\/private\/(account|my)\/.*$/, appFilter.isExistsAccount);
appInit.initRouters(routers, routerPath);
app.use(routers);
app.use(appFilter.notFound);
app.use(appFilter.sysError);
appFilter.backLine();

module.exports = app;
