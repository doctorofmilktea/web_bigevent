// 每次调用$.get(),$.post(),$.ajax()时，先调用ajaxPrefilter这个函数
// 得到配置对象
$.ajaxPrefilter(function(options){
    // 在发起真正的ajax请求前，统一拼接根路径
    options.url = 'http://www.liulongbin.top:3007'+options.url;
})