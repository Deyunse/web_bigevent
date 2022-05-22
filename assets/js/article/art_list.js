$(function () {
    const layer = layui.layer
    const form = layui.form
    const laypage = layui.laypage
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    const q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: "", // 文章分类的 Id
        state: "", // 文章的发布状态
    };

    const initTable = () => {
        $.ajax({
            type: "GET",
            url: '/my/article/list',
            data: q,
            success: (res) => {
                if (res.status !== 0) return layer.msg("获取文章列表失败！")
                // layer.msg("获取文章列表成功！")
                const htmlStr = template("tpl-table", res)
                $("tbody").html(htmlStr)
                renderPage(res.total)
            }
        })
    }
    initTable()
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

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    const initCate = () => {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: (res) => {
                if (res.status !== 0) return layer.msg("获取文章列表失败！")
                const htmlStr = template("tpl-cate", res)
                $("[name=cate_id]").html(htmlStr)
                form.render()
            }
        })
    }
    initCate()


    $("#form-search").on("submit", (e) => {
        e.preventDefault()
        const cate_id = $("[name=cate_id]").val()
        const state = $("[name=state]").val()
        // 将用户选择筛选的条件 赋值 然后重新调用 initTable() 方法 返回数据
        q.cate_id = cate_id
        q.state = state
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],// 每页展示多少条
            jump: (obj, first) => {
                console.log(obj.limit);
                // 1、laypage.render 调用就会触发（首次触发，我们不希望调用 initTable()）
                // 2、切换页码时候就会触发，必须调用 initTable()    
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {

                    initTable()
                }
            }

        })
    }

    // 删除文章
    $("tbody").on("click", ".btn-delete", function () {
        const id = $(this).attr("data-id");
        const len = $(".btn-delete").length;
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: "GET",
                url: '/my/article/delete/' + id,
                success: (res) => {
                    if (res.status !== 0) return layer.msg("删除列表失败！")
                    layer.msg("删除列表成功！")
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1 
                    }
                    initTable()
                }
            })
            layer.close(index)
        })
    })
})