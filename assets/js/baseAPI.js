$.ajaxPrefilter(function (options) {
    //拼接路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;
})