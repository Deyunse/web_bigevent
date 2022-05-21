// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
// 请求拦截器
$.ajaxPrefilter((options) => {
    options.url = `http://www.liulongbin.top:3007` + options.url
    // console.log(options.url.includes("/my/"));
    if (options.url.includes("/my/")) {
        options.headers = {
            Authorization: localStorage.getItem("token"),
        }
    }
    // 统一处理 权限问题
    options.complete = (res) => {
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 清空 token
            localStorage.removeItem("token")
            // 跳转到 登录页面
            location.href = "/login.html"
        }
    }
})