$(function () {
    // 点击去注册
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    // 点击去登录
    $('#link_login').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').show();
    })


    // 自定义校验
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })
    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() };
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {

                return layer.msg(res.message);
            }
            layer.msg('注册成功，请登录！');
            // 注册成功后自动跳转登录页面的模拟点击
            $('#link_login').click();
        })
    })
    // 监听登录表单的提交事件
    $('#form_login').submit(function(e){
        e.preventDefault();
        $.ajax({
            url:'/api/login',
            method: 'POST',
            // 快速获取表单数据
            data:$(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！');
                // 将登陆成功的token保存到localstorage里
                localStorage.setItem('token',res.token)
                // console.log(res.token);
                // 跳转后台页面
                location.href= '/index.html';
            }
        })
    })
})