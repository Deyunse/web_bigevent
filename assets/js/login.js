$(function () {
    // 点击切换效果
    $("#link_reg").click(() => {
        $(".login-box").hide();
        $(".reg-box").show();
    })

    $("#link_login").click(() => {
        $(".login-box").show();
        $(".reg-box").hide();
    })
    //  获取 form
    const form = layui.form

    form.verify({
        // 定义校验 密码的规则
        pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        // 定义确认密码、
        repwd: (val) => {
            const pwd = $(".reg-box [name=password]").val();
            if (val !== pwd) return "两次密码不一致！"
        }
    })

    const layer = layui.layer
    // 监听表单提交事件 发起请求
    $("#form_reg").on("submit", (e) => {
        // 阻止表单 默认提交事件
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: '/api/reguser',
            data: {
                username: $("#form_reg [name=username   ]").val(),
                password: $("#form_reg [name=password]").val()
            }, success: (res) => {
                if (res.status !== 0) return layer.msg('注册失败!')
                layer.msg('注册成功!')
                $("#link_login").click()
            }
        })
    })
    // 监听登录表单事件，发送登录请求
    $("#form_login").on('submit', function (e) {
        e.preventDefault()

        $.ajax({
            type: "POST",
            url: '/api/login',
            data: $(this).serialize(),// 将当前表单内的数据 转换为 username=%E4%BD%A0%E8%BF%98%E5%A5%BD%E5%90%97&password=111111 类型
            success: (res) => {
                // console.log(res);
                console.log($(this).serialize());
                if (res.status !== 0) return layer.msg("登录失败");
                layer.msg("登录成功")
                localStorage.setItem("token", res.token); // 将身份的唯一表示 存储到本地 后面还要用
                location.href = "/index.html"
            }
        })
    })
})