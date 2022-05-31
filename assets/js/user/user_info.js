$(function () {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function (value) {
            if (value > 6) {
                return '昵称长度必须在1~6之间！'
            }
        }
    })
    initUserInfo();
    //获取用户的基本信息
    function initUserInfo() {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",

            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // console.log(res.data);
                // 表单赋值 / 取值 
                form.val('formUserinfo', res.data);
            }
        });
    }

    //实现表单的重置效果
    $('[type=reset]').on('click', function (e) {
        //阻止表单的默认重置行为
        e.preventDefault();
        //获取用户的基本信息
        initUserInfo();
    })
    //监听表单提交事件
    $('.layui-form').on('submit', function name(e) {
        //阻止表单默认提交行为
        e.preventDefault();
        // 发起请求更新用户信息
        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！');
                }
                layer.msg('更新用户信息成功');
                //调用父类 获取用户的基本信息

                window.parent.getUserInfo();
            }
        });
    })

})