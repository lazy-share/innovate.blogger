/**
 * Created by laizhiyuan on 2017/10/14.
 */
tinymce.PluginManager.add('uploadimage', function (editor) {

    function selectLocalImages() {
        var dom = editor.dom;
        var input_f = $('<input type="file" name="thumbnail" accept="image/jpg,image/jpeg,image/png,image/gif" multiple="multiple">');
        input_f.on('change', function () {
            var form = $("<form/>",
                {
                    action: editor.settings.images_upload_url + '/' + editor.settings.username, //设置上传图片的路由，配置在初始化时
                    style: 'display:none',
                    method: 'post',
                    enctype: 'multipart/form-data'
                }
            );
            form.append(input_f);
            //ajax提交表单
            form.ajaxSubmit({
                headers: {"LzyAuthorization": editor.settings.token},
                beforeSubmit: function () {
                    return true;
                },
                success: function (data) {
                    console.log(data);
                    if (data && data.file_path) {
                        editor.focus();
                        if (data.file_path instanceof Array) {
                            data.file_path.forEach(function (src) {
                                editor.selection.setContent(dom.createHTML('img', {src: src}));
                            })
                        } else {
                            editor.selection.setContent(dom.createHTML('img', {
                                src: data.file_path,
                                'class': "img-responsive"
                            }));
                        }
                    }
                }
            });
        });

        input_f.click();
    }

    editor.addCommand("mceUploadImageEditor", selectLocalImages);

    editor.addButton('uploadimage', {
        icon: 'image',
        tooltip: '上传图片',
        onclick: selectLocalImages
    });

    editor.addMenuItem('uploadimage', {
        icon: 'image',
        text: '上传图片',
        context: 'tools',
        onclick: selectLocalImages
    });
});
