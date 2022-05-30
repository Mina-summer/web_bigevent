$.ajaxPrefilter(function (options) {
    //拼接路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;

    //统一为有权限的接口设置header请求
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //控制用户的访问权限
    //不论访问是否成功都是执行complete回调函数
    options.complete = function (res) {
        // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //清除token
            localStorage.removeItem('token');
            //强制跳转
            location.href = '/login.html';
        }

    }
})