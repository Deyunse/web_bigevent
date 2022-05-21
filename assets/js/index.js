$(function () {
    getUserInfo()
    // 点击退出按钮
    const layer = layui.layer
    $("#btnLongin").click(() => {
        layer.confirm("确定退出登录？",
            { icon: 3, title: "" },
            function (index) {
                // 删除本地存储
                localStorage.removeItem("token")
                // 跳到登陆页面
                location.href = "/login.html"
            })
    })

})
const layer = layui.layer
// 获取用户信息 放在入口函数外面 以方便 后面的页面调用
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        // 在请求里面注入 登陆页面保存的 token
        // headers: {
        //     Authorization: localStorage.getItem("token"),
        // }, 
        success: (res) => {
            if (res.status !== 0) return layer.msg("获取用户信息失败！")
            layer.msg("获取用户信息成功！")
            renderAvatar(res.data)
            // 不论请求成功还是失败 都会调用complete
        }
        // ,complete: (res) => {
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         localStorage.removeItem("token")
        //         location.href = "/login.html"
        //     }
        // }
    })

    // 渲染头像
    const renderAvatar = (user) => {
        // 获取名字
        const name = user.nickname || user.username
        // 设置欢迎文本
        $("#welcome").html(`欢迎 ${name}`)
        // 按需渲染头像
        if (user.user_pic !== null) {
            $(".layui-nav-img").attr("src", user.user_pic).show()
            $(".text-avatar").hide()
        } else {
            $(".layui-nav-img").hide()
            const firstName = name[0].toUpperCase()
            $(".text-avatar").html(firstName).show()
        }
    }
}