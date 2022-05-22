$(function () {
    const layer = layui.layer
    const form = layui.form
    // 获取文章数据
    const initArtaCateLists = () => {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: (res) => {
                if (res.status !== 0) return layer.msg("获取文章列表失败！")
                layer.msg("获取文章列表成功！")
                const htmlStr = template("tpl-table", res)
                $("tbody").html(htmlStr)
            }
        })
    }
    initArtaCateLists()
    // 添加分类的弹窗
    let indexAdd = null
    $("#btnAddCate").click(() => {
        indexAdd = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "添加文章分类",
            content: $("#dialog-add").html(),
        });
    });
    $("body").on("submit", "#form-add", function (e) {
        e.preventDefault();

        $.ajax({
            type: "POST",
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) return layer.msg("添加列表失败！")
                layer.msg("添加列表成功！")
                initArtaCateLists()
                layer.close(indexAdd)

            }
        })
    })
    // 修改分类弹框
    let indexEdit = null;
    $("tbody").on("click", ".btn-edit", function () {
        indexEdit = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "添加文章分类",
            content: $("#dialog-edit").html(),
        });
        // console.log($(this).attr("data-id"));

        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + $(this).attr("data-id"),
            success: (res) => {
                console.log(res);
                if (res.status !== 0) return layer.msg("获取文章信息失败！")
                layer.msg("获取文章信息成功！")
                form.val("form-edit", res.data)
            }
        })
    })
    // 更新文章分类
    $("body").on("submit", "#form-edit", function (e) {
        e.preventDefault()

        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) return layer.msg("更新文章信息失败！")
                layer.msg("更新文章信息成功！")
                layer.close(indexEdit)
                initArtaCateLists()
            }
        })
    })

    $("tbody").on("click", ".btn-delete", function () {
        const id = $(this).attr("data-id")
        // 提示用户是否删除
        layer.confirm("确定删除吗？", { icon: 3, title: "提示" }, function (index) {
            $.ajax({
                type: "GET",
                // 传入id 删除对应的数据
                url: "/my/article/deletecate/" + id,
                success: (res) => {
                    if (res.status !== 0) return layer.msg("删除文章失败！")
                    layer.msg("删除文章成功！")
                    layer.close(index)
                    initArtaCateLists()
                }
            })
        })
    })
})