const express = require('express');
const app = express();
const path = require('path');
const url = require('url');
const bodyParser = require('body-parser');
const log4js = require('log4js');

const appInit = require('./init/app_init');
appInit.initLog4js(app);
appInit.initMongoDb();
const routers = express.Router();
const modelPath = path.join(__dirname, 'models');
const routerPath = path.join(__dirname, 'routers');
appInit.initModels(modelPath);

//配置中间件
const appFilter = require('./filter/app_filter');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public/web", express.static(path.join(__dirname, '/public/web')));
app.use(bodyParser({uploadDir: path.join(__dirname, 'public/images')}));
app.all('*', appFilter.crossDomain);
app.use(appFilter.security);
app.all('/v1/api/web/private/account/**', appFilter.isExistsAccount);
app.use(appFilter.sysError);
appFilter.backLine();
/*
app.use(appFilter.notFound);
app.use(appFilter.sysError);
 appFilter.backLine();
*/
appInit.initRouters(routers, routerPath);
app.use(routers);

module.exports = app;
