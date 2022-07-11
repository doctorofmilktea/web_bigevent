$(function(){
    // 调用函数获取用户基本信息
    getUserInfo();
    var layer = layui.layer;
    $('#btnLogout').on('click',function(){
        // 提示用户是否退出
        layer.confirm('确定推出登录？', {icon: 3, title:'提示'}, function(index){
            // 清空本地存储的token
            localStorage.removeItem('token');
            // 跳转页面
            location.href='/login.html';
            layer.close(index);
          });
    })
})


// 获取用户基本信息
function getUserInfo(){
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        // 请求头配置对象
        // headers:{
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success:function(res){
            if(res.status !== 0){
                return layui.layer.msg('获取用户信息失败！')
            }
            // 渲染用户头像
            renderAvatar(res.data);
            
        },
        // 无论成功失败都会调用complete函数
        // complete:function(res){
        //     // console.log('执行了complete');
        //     // console.log(res);
        //     // 在complete回调函数中，可以使用res.responseJSON拿到服务器相应回来的数据
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
        //         // 强制清空TOKEN
        //         localStorage.removeItem('token');
        //         // 强制跳转
        //         location.href = '/login.html';
        //     }
        // }
    }) 
}
// 渲染用户头像和名字
function renderAvatar(user){
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp&nbsp' + name);
    if(user.user_pic !== null){
        $('.layui-nav-img').attr('src',user.user_pic).show();
        $('.text-avatar').hide();
    }else{
        $('.layui-nav-img').hide();
        var first=name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}