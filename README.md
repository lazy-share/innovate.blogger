## 本地windows运行
###### 下载项目
```
git clone https://github.com/lazy-share/innovate.blogger.git
```
###### 安装node6
```
https://nodejs.org/dist/latest-v6.x/node-v6.17.1-win-x86.zip
```
###### 安装nginx
```
http://nginx.org/download/nginx-1.6.3.zip
```

###### 安装mongodb
```

```

## 生产环境部署

###### 创建tarball目录
mkdir -p /usr/local/zip

###### 下载项目
git https://github.com/lazy-share/innovate.blogger.git

###### 准备centos7
例如阿里云/腾讯云


###### 准备域名
例如：www.laizhiy.cn

没有域名直接ip访问也行
###### 安装mongodb
vi /etc/yum.repos.d/mongodb-org-4.0.repo
内容如下：

```angular2html
[mongodb-org-4.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/4.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.0.asc
```
yum安装命令：
```angular2html
yum install -y mongodb-org-4.0.9 mongodb-org-server-4.0.9 mongodb-org-shell-4.0.9 mongodb-org-mongos-4.0.9 mongodb-org-tools-4.0.9
```
防止yum更新
vi /etc/yum.conf
末尾追加：
```angular2html
exclude = mongodb-org，mongodb-org-server，mongodb-org-shell，mongodb-org-mongos，mongodb-org-tools
```

启动：
```angular2html
systemctl start mongod
```

###### 安装nginx
```angular2html
cd /usr/local/zip
wget http://nginx.org/download/nginx-1.6.3.tar.gz
tar -zxvf nginx-1.6.3.tar.gz -C ../
cd ../nginx-1.6.3
yum install gc gcc gcc-c++ pcre-devel zlib-devel make wget openssl-devel libxml2-devel libxslt-devel gd-devel perl-ExtUtils-Embed GeoIP-devel gperftools gperftools-devel libatomic_ops-devel perl-ExtUtils-Embed dpkg-dev libpcrecpp0 libgd2-xpm-dev libgeoip-dev libperl-dev -y

cd /usr/local/nginx-1.6.3
./configure
make
make install
```
vi /etc/profile
```angular2html
export NG_HOME=/usr/local/nginx
export PATH=$PATH:$NG_HOME/sbin
```
nginx.conf内容如下：
```angular2html
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
	
	location /media {
            root /;
            rewrite ^/media/(.*)$ /usr/local/publish/media/$1 break;
          
        }

        location / {
            root   /usr/local/publish/web;
            index  index.html;
        }

        location /v1/api {
            proxy_pass http://localhost:3000/v1/api;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }

}

```


###### 安装nodejs
```angular2html
cd /usr/local/zip
wget https://nodejs.org/dist/v10.15.3/node-v10.15.3-linux-x64.tar.xz
tar -xvf node-v10.15.3-linux-x64.tar.xz -C ../

```

###### 安装pm2

######