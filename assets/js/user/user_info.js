$(function () {
    const layer = layui.layer
    const form = layui.form

    form.verify({
        nickname: (val) => {
            if (val.length > 6) return "昵称长度必须在 1 ~ 6 个字符之间！"
        }
    });

    // 获取用户基本信息
    const initUserinfo = () => {
        $.ajax({
            type: "GET",
            url: '/my/userinfo',
            success: (res) => {
                console.log(res);
                if (res.status !== 0) return layer.msg("获取用户信息失败！")
                layer.msg("获取用户信息成功！")
                // form.val("formUserInfo", res.data)
                form.val("formUserInfo", res.data);
            }
        })
    }
    initUserinfo();

    // 重置用户信息
    $("#btnReset").click((e) => {
        // 阻止表单默认提交事件、
        e.preventDefault();
        // 调用用户基本信息函数 实现重置效果
        initUserinfo();

    })

    // 更新用户信息
    $(".layui-form").on("submit", function (e) {
        e.preventDefault();

        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            // serialize() 获取form表单内容
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) return layer.msg("更新用户信息失败！")
                layer.msg("更新用户信息成功！")

                // 调用 getUserInfo 方法更新用户头像
                window.parent.getUserInfo()
            }
        })
    })
})


