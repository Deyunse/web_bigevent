$(function () {
    const layer = layui.layer
    const form = layui.form
    //  获取类型数据
    const initCate = () => {
        $.ajax({
            type: 'GET',
            url: "/my/article/cates",
            success: (res) => {
                if (res.status !== 0) return layer.msg("获取类型失败！")
                layer.msg("获取类型成功！")
                const htmlStr = template("tpl-cate", res)
                $("[name=cate_id").html(htmlStr)
                // 重新渲染指定的标签
                form.render("select")
            }
        })
    }
    initCate()

    // 初始化富文本编辑器
    initEditor()


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 点击上传图片
    $('#btnChooseImage').on('click', function () {
        $("#coverFile").click()
    })
    // 
    $("#coverFile").change((e) => {
        // 
        const files = e.target.files
        if (files.length === 0) return
        const newImgUrl = URL.createObjectURL(files[0])
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgUrl) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义发布文章的状态
    let art_status = "已发布"
    // 点击草稿 将 值修改为草稿
    $("#btnSave2").click(() => {
        art_status = "草稿"
    })
    // 监听form 提交事件
    $("#form-pub").on("submit", function (e) {
        e.preventDefault()
        const fd = new FormData($(this)[0]);
        fd.append("state", art_status)
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publisthAticle(fd)
            })
    })
    // 发送新增文章请求
    const publisthAticle = (fd) => {
        $.ajax({
            type: "POST",
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: (res) => {
                if (res.status !== 0) return layer.msg("新增文章失败！")
                layer.msg("新增文章成功！")

                location.href = "/article/art_list.html"
                window.parent.change()
            }
        })
    }
})  