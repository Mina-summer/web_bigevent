$(function () {
    // 调用获取用户的基本信息函数
    getUserInfo();

    //退出功能
    $('.btnLogout').on('click', function () {
        layer.confirm('确定退出登录?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //清除token
            localStorage.removeItem('token');
            //重定向到login.html
            location.href = '/login.html';
            //关闭弹出框
            layer.close(index);
        });
    })
})
//获取用户的基本信息
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败');
            }
            // 调用渲染用户头像函数
            renderAvatar(res.data);
        }

    });
}

//渲染用户头像
function renderAvatar(user) {
    //获取用户名
    var name = user.nickname || user.username;
    //设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 判断用户是否有头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}