$(function () {
    var layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //隐藏file文本框

    //给上传按钮绑定点击事件 
    $('#btnChooseImage').on('click', function () {
        //模拟file文本框点击事件
        $('#file').click();
    });

    //给file绑定change事件
    $('#file').on('change', function (e) {
        //获取文件列表
        var filelist = e.target.files;
        // console.log(filelist);
        if (filelist.length === 0) {
            return layer.msg('请选择图片！');
        }
        // 拿到用户选择的文件
        var file = e.target.files[0];
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file);
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域

        //为确定按钮绑定点击事件
        $('#btnUpload').on('click', function () {
            // 将裁剪后的头像上传到服务器
            // 将裁剪后的图片，输出为 base64 格式的字符串
            var dataURL = $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 100,
                    height: 100
                })
                .toDataURL('image/png'); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

            //调用接口，把头像上传到服务器
            $.ajax({
                type: "POSt",
                url: "/my/update/avatar",
                data: {
                    avatar: dataURL
                },
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('更换头像失败！');
                    }

                    layer.msg('更换头像成功！');
                    //调用 获取用户基本信息函数
                    window.parent.getUserInfo();
                }
            });

        })
    })
})