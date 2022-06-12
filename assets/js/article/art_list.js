$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }


    initTable();
    initCate();
    // 获取文章列表数据方法


    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr);
                //分页
                renderPage(res.total);
            }
        })
    }
    //定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }
    // 定义美化时间的过滤器
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败');
                }
                //调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                //通过layui重新渲染表单区域的UI结构
                form.render();

            }
        });
    }

    //为表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        //获取表单中选中的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state').val();
        q.cate_id = cate_id;
        q.state = state;
        //根据最新的筛选条件重新渲染表格数据
        initTable();
    })

    //分页
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示的条数
            curr: q.pagenum, //起始页   
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //自定义排班
            limits: [2, 3, 5, 10], //每页条数的选择项
            jump: function (obj, first) {
                // // jump - 切换分页的回调
                // 当分页被切换时触发，函数返回两个参数：obj（当前分页的所有选项值）、first（是否首次，一般用于初始加载的判断）
                // obj.curr得到当前页
                // obj.limit得到每页显示的条数
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    initTable();
                }
            }

        });
    }

    //通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        //获取当前文章的id
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {


            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！');
                    }
                    layer.msg('删除文章成功！');
                    initTable();
                }
            });
            layer.close(index);
        });
    })

})