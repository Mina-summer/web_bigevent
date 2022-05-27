$(function () {

    // 点击去注册账号的链接
    $('#link_reg').on('click', function () {
        // 登录盒子隐藏，注册盒子显示
        $('.login-box').hide();
        $('.reg-box').show();
    })
    // 点击去登录的链接
    $('#link_login').on('click', function () {
        // 注册盒子隐藏，登录盒子显示
        $('.reg-box').hide();
        $('.login-box').show();
    });

    /* 自定义表单验证规则 */
    // 从layui中获取form对象
    var form = layui.form;
    // 获取layui弹出层对象layer
    var layer = layui.layer;
    /* 通过form.verify()函数自定义表单验证规则 */
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            //获取第一次输入的密码
            var pwd = $('.reg-box [name="password"]').val();
            //判断两次输入的密码是否一致
            if (pwd !== value) {
                return '两次输入的密码不一致！'
            }

        }

    });

    // 发起注册用户的Ajax请求
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post("/api/reguser", data, function (res) {
            if (res.status !== 0) {
                // return console.log(res.message);
                return layer.msg(res.message);
            }
            // console.log('注册成功');
            layer.msg('注册成功，请登录');
        });
        // 模拟人的点击行为，跳转到登录页面
        $('#link_login').click();

    });
    // 发起登录的Ajax请求
    $('#form_login').submit(function (e) {
        //阻止表单提交默认行为
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/api/login",
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败');
                }
                layer.msg('登录成功');
                // 将登录成功后得到的token字符串， 保存到localStorage中
                localStorage.setItem('token', res.token);
                // 跳转到后天主页
                location.href = '/index.html';
            }
        });

    });



})