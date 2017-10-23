#! /bin/bash

#init var
date=`date +%Y%m%d-%H%M%S`
back_images_dir=/usr/local/back/images
back_web_node_modules_dir=/usr/local/back/node_modules/web
back_server_node_modules_dir=/usr/local/back/node_modules/server
back_images_zip=${back_images_dir}/public-${date}.tar.gz
back_web_node_modules_zip=${back_web_node_modules_dir}/node_modules-${date}.tar.gz
back_server_node_modules_zip=${back_server_node_modules_dir}/node_modules-${date}.tar.gz
build_dir=/usr/local/build
branch=develop
project_name=innovate.blogger
web_module=${build_dir}/${project_name}/web
web_module_envfile=${web_module}/package.json
server_module=${build_dir}/${project_name}/server
server_module_envfile=${server_module}/conf/environments.js
git_address=https://github.com/lzy369/innovate.blogger

#make build dir
if [ ! -d "${build_dir}" ];then
	echo "=================>${build_dir} dir not exists, created it now"
	mkdir -p ${build_dir}
else
	echo "======================>${build_dir} exists"

fi
sleep 3s

#make bakc images dir
if [ ! -d "${back_images_dir}" ];then
	echo "===============> ${back_images_dir} dir not exists, created it now"
	mkdir -p ${back_images_dir}
else
	echo "===================> ${back_images_dir} dir exists"
fi
sleep 3s

#make bakc web node_modules dir
if [ ! -d "${back_web_node_modules_dir}" ];then
        echo "===============> ${back_web_node_modules_dir} dir not exists, created it now"
        mkdir -p ${back_web_node_modules_dir}
else
        echo "===================> ${back_web_node_modules_dir} dir exists"
fi
sleep 5s

#make bakc server node_modules dir
if [ ! -d "${back_server_node_modules_dir}" ];then
        echo "===============> ${back_server_node_modules_dir} dir not exists, created it now"
        mkdir -p ${back_server_node_modules_dir}
else
        echo "===================> ${back_server_node_modules_dir} dir exists"
fi
sleep 3s

#back images web and server node_modules after clear project
if [ -d "${build_dir}/${project_name}" ];then
	echo "=================> ${build_dir}/${project_name} exists, begin back images node_modules after delete ${build_dir}/${project_name}";
	tar -zcvf ${back_images_zip} ${server_module}/public
	tar -zcvf ${back_server_node_modules_zip} ${server_module}/node_modules
	tar -zcvf ${back_web_node_modules_zip} ${web_module}/node_modules
	rm -rf ${build_dir}/${project_name}

fi;
sleep 5s

#clone project
cd ${build_dir} && echo "============> current dir `pwd`"
git clone -b ${branch} ${git_address}
test $? != 0 && echo "git clone faild" && exit 1
sleep 3s

#recovery images
rm -rf ${server_module}/public
mkdir -p ${server_module}/public
mkdir -p ${server_module}/node_modules
mkdir -p ${web_module}/node_modules
tar -zxvf ${back_images_zip} -C /
tar -zxvf ${back_web_node_modules_zip} -C /
tar -zxvf ${back_server_node_modules_zip} -C /
sleep 5s

#install server
sed -i "s/dev/prod/g" ${server_module_envfile}
cd ${server_module} && npm install

#install web
sed -i "s/disable-host-chec/disable-host-chec --env=prod/g" ${web_module_envfile}
cd ${web_module} && npm install


