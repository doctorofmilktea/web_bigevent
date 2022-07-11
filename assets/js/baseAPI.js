// 每次调用$.get(),$.post(),$.ajax()时，先调用ajaxPrefilter这个函数
// 得到配置对象
$.ajaxPrefilter(function (options) {
    // 在发起真正的ajax请求前，统一拼接根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    // 统一为有权限的接口设置headers请求头
    if (options.url.indexOf('/my/' !== -1)) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 全局统一挂载complete函数
    options.complete = function (res) {
        // console.log('执行了complete');
        // console.log(res);
        // 在complete回调函数中，可以使用res.responseJSON拿到服务器相应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空TOKEN
            localStorage.removeItem('token');
            // 强制跳转
            location.href = '/login.html';
        }

    }
})