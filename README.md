## 本地windows运行
###### 下载项目
```
git clone https://github.com/lazy-share/innovate.blogger.git
git checkout develop
```
###### 安装node6
下载地址：
```
https://nodejs.org/dist/latest-v6.x/node-v6.17.1-win-x86.zip
```
安装方式比较简单，具体不截图，如果确实没有能力安装，可以查阅网络资料，建议安装版本为6.x

安装好之后配置环境变量，安装和配置好之后通过cmd下面命令进行验证

```html
node -v
npm -v
```


###### 安装mongodb

自行查阅网络资料，这里给出我的一篇博客供参考。或者也可以参考官方文档或其它网络资料。
```
https://blog.csdn.net/lzy_zhi_yuan/article/details/76438864
```
版本号目前最新为4.0.9，建议下载3.2.x或3.4.x版本,其它版本可能导致文章无法评论，
因为在mongodb 3.6版本开始pushAll方法被遗弃。

安装好之后启动，配置权限，配置方式如下：
(如果不熟悉mongodb权限配置的可以参考我的这篇博客)
建议直接阅读官方文档进行学习
```
https://blog.csdn.net/lzy_zhi_yuan/article/details/76571696
```
```html
//命令行连接
mongo
//切换admin库
use admin
//创建账号管理员账号useradmin
db.createUser(
{user: "useradmin",
pwd: "123456",
roles: ["userAdminAnyDatabase"]}
)
//重启mongod服务，开启验证权限
mongod --auth
//Ctrl + C后再次命令行连接
mongo
//切换admin库
use admin
//验证到拥有创建用户的权限到admin数据库
db.auth("useradmin", "123456")
//创建数据库管理员账号dbadmin
db.createUser({
user: "dbadmin",
pwd: "123456",
roles:["readWriteAnyDatabase", "dbAdminAnyDatabase", "clusterAdmin"]
})
//切换到admin数据库
use admin
//验证到拥有创建数据库的权限到admin数据库
db.auth("dbadmin", "123456")
//创建blogger数据库
use blogger
//创建拥有读写blogger数据库账号
db.createUser(
{
user:"laizhiyuan",
pwd:"123456",
roles:["readWrite"]
}
)
//切换到blogger数据库
use blogger
db.auth("laizhiyuan", "123456")
//在数据库blogger上创建集合example
db.createCollection("example")

至此，我们创建了博客需要的数据库blogger，且配置好了安全权限，很好。

```
###### 构建项目
安装好node以及启动好了mongodb后就开始构建项目

通过cmd命令行窗口cd 到innovate.blogger目录下,下面以$BLOGGER_HOME代表该目录。
```html
1、cd $BLOGGER_HOME/server
2、npm install
3、首次启动放开$BLOGGER_HOME/server/app.js文件的下面三行初始化数据代码注释：
require('./db_script/article-type-script').initSysDefaultArticleType();
require('./db_script/address-script')();
require('./db_script/news-type-script')();
4、启动后台服务
node $BLOGGER_HOME/server/bin/www
5、Ctrl + C停止，注释初始化代码
//require('./db_script/article-type-script').initSysDefaultArticleType();
//require('./db_script/address-script')();
//require('./db_script/news-type-script')();
6、再次启动后台服务
node $BLOGGER_HOME/server/bin/www
7、cd $BLOGGER_HOME/web
8、npm install
9、将$BLOGGER_HOME/temp 复制到$BLOGGER_HOME/web/node_modules/tinymce/plugins目录下
10、npm start
11、浏览器访问：http://127.0.0.1:4200

至此，本地部署完成。

```

## 生产部署
生产部署有自动化部署脚本，放置位置为：
```html
$BLOGGER_HOME/doc/publish_blogger.sh
```
1、在生产环境安装好nodejs和mongodb以及nginx

2、mongodb配置需要参考上面本地部署方式设置好权限和数据库

3、配置好环境变量

4、全局安装pm2

npm install pm2 -g

nginx配置文件内容如下：
```html
worker_processes  1;

events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;
    gzip  on;
    server {
        listen       80;
        server_name  www.laizhiy.cn;
	    location /v1/api {
            proxy_pass http://www.laizhiy.cn:3000/v1/api;
        }
	    location /media {
            root /;
            rewrite ^/media/(.*)$ /usr/local/publish/media/$1 break;
          
        }
        location / {
            root   /usr/local/publish/web;
            index  index.html;
        }
    }
}

```
###### 说明:
1、其中www.laizhiy.cn需要改为你自己的域名或ip

2、然后全局搜索项目关键字www.laizhiy.cn，改为你的域名或ip

3、将publish_blogger.sh上传到你的服务器

4、转为unix文件格式

yum install dos2unix

dos2unix publish_blogger

5、执行脚本

sh publish_blogger

###### 关注我

![微信公众号](https://github.com/lazy-share/generate-db-dict/blob/master/images/weixin.jpg)

