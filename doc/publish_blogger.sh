#! /bin/bash
#Author: laizhiyuan
#Created: 2017-10-24
#Desc: build blogger publish script

#init var
date=`date +%Y%m%d-%H%M%S`
back_root_dir=/usr/local/back
back_web_root_dir=${back_root_dir}/web
back_server_root_dir=${back_root_dir}/server
back_server_pre_publish_zip=server-${date}.tar.gz
back_server_pre_publish_dir=${back_server_root_dir}/publish
back_web_pre_publish_zip=web-${date}.tar.gz
back_web_pre_publish_dir=${back_web_root_dir}/publish

build_root_dir=/usr/local/build
clone_project_dir=${build_root_dir}/innovate.blogger
branch=develop
build_web_sources_dir=${clone_project_dir}/web
build_server_sources_dir=${clone_project_dir}/server
server_module_envfile=${build_server_sources_dir}/conf/environments.js
publish_server_name=blogger-server
build_web_name=web

publish_root_dir=/usr/local/publish
upload_video_dir=${publish_root_dir}/media/video
upload_image_header_dir=${publish_root_dir}/media/images/header
upload_image_article_dir=${publish_root_dir}/media/images/article
upload_image_photo_dir=${publish_root_dir}/media/images/photo
init_header_file=${build_server_sources_dir}/public/web/images/header/initHead.jpg
git_address=git@github.com:lazy-demo/innovate.blogger.git

test ! -d ${upload_video_dir} && mkdir -p ${upload_video_dir}
test ! -d ${upload_image_header_dir} && mkdir -p ${upload_image_header_dir}
test ! -d ${upload_image_article_dir} && mkdir -p ${upload_image_article_dir}
test ! -d ${upload_image_photo_dir} && mkdir -p ${upload_image_photo_dir}

#make build dir
if [ ! -d "${build_root_dir}" ];then
	echo "=================>${build_root_dir} dir not exists, created it now"
	mkdir -p ${build_root_dir}
else
	echo "======================>${build_root_dir} exists"

fi
sleep 2s

#make bakc root dir
if [ ! -d "${back_root_dir}" ];then
	echo "===============> ${back_root_dir} dir not exists, created it now"
	mkdir -p ${back_root_dir}
else
	echo "===================> ${back_root_dir} dir exists"
fi
sleep 2s

#make bakc web publish dir
if [ ! -d "${back_web_pre_publish_dir}" ];then
        echo "===============> ${back_web_pre_publish_dir} dir not exists, created it now"
        mkdir -p ${back_web_pre_publish_dir}
else
        echo "===================> ${back_web_pre_publish_dir} dir exists"
fi
sleep 2s

#make bakc server publish dir
if [ ! -d "${back_server_pre_publish_dir}" ];then
        echo "===============> ${back_server_pre_publish_dir} dir not exists, created it now"
        mkdir -p ${back_server_pre_publish_dir}
else
        echo "===================> ${back_server_pre_publish_dir} dir exists"
fi
sleep 2s

#clone project
cd ${build_root_dir} && echo "============> current dir `pwd`"
if [ -d $clone_project_dir ]; then
        cd $clone_project_dir
        git pull origin $branch
else
        cd $build_root_dir
        git clone -b $branch $git_address
fi;
test $? != 0 && echo "git clone faild" && exit 1
sleep 3s

#update server module env
sed -i "s/dev/prod/g" ${server_module_envfile}

#install
cd ${build_server_sources_dir} && npm install
cd ${build_web_sources_dir} && npm install 

#copy required file
cp -R ${clone_project_dir}/temp/uploadimage ${build_web_sources_dir}/node_modules/tinymce/plugins
cp  ${init_header_file} ${upload_image_header_dir}/

#build web pages
npm run build:aot
npm run build

#back pre publish version
test -d ${publish_root_dir}/server && tar -zcvf ${back_server_pre_publish_dir}/${back_server_pre_publish_zip} ${publish_root_dir}/server && rm -rf ${publish_root_dir}/server
test -d ${publish_root_dir}/web && tar -zcvf ${back_web_pre_publish_dir}/${back_web_pre_publish_zip} ${publish_root_dir}/web && rm -rf ${publish_root_dir}/web

#copy current resources to publish
cp -R ${build_server_sources_dir} ${publish_root_dir}/
cp -R ${build_web_sources_dir}/web ${publish_root_dir}/

#restart server
pid=`pm2 list | grep "${publish_server_name}" | awk '{print $2}'`
echo "================= pid: ${pid} " 
if [ $pid != '' ]; then
	pm2 restart ${publish_server_name}
else
	pm2 start ${publish_root_dir}/server/bin/www --name "${publish_server_name}"

fi

