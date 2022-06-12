$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList()

    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    //为添加类别绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    //通过代理的形式，为form-add表单绑定submit提交事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败');
                }


                layer.msg('新增分类成功');
                //关闭弹出层
                layer.close(indexAdd);
                // 获取文章分类的列表
                initArtCateList();
            }
        });
    })

    //通过代理的形式，为btn-edit编辑按钮绑定点击事件
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });


        // 为修改文章分类的弹出层填充表单数据

        // 为编辑按钮绑定 data-id自定义属性,获取自定义属性值
        var id = $(this).attr('data-id');
        //发起请求，获取对应分类的数据
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                form.val('form-edit', res.data);
            }
        });

    });

    //通过代理的形式，为form-edit表单绑定submit提交事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改分类失败！')
                }
                layer.msg('修改分类成功！');
                //关闭弹出层
                layer.close(indexEdit);
                // 获取文章分类的列表
                initArtCateList();
            }
        });
    });

    //通过代理的形式，为btn-delete删除按钮绑定点击事件
    $('tbody').on('click', '#btn-delete', function () {
        //获取自定义属性值
        var id = $(this).attr('data-id');
        // 删除弹出层
        layer.confirm('确定删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！');
                    }
                    layer.msg('删除分类成功！');
                    layer.close(index);
                    // 获取文章分类的列表
                    initArtCateList();
                }
            });


        });


    });
})