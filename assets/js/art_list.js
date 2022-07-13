$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)
    
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
    
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
    
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
      }
    
      // 定义补零的函数
      function padZero(n) {
        return n > 9 ? n : '0' + n
      }
    // 定义查询的参数对象,将来请求数据的时候,将q提交到服务器
    var q = {
        pagenum: 1, //页码,默认第一页
        pagesize: 2, //每页显示几条数据,默认2
        cate_id: '', //文章分类ID,默认空
        state: '' //文章的发布状态，可选值有：已发布、草稿,默认空
    }

    initTable();
    initCate()
    // 获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                // 调用渲染分页
                renderPage(res.total)
            }
        })
    }
    // 初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                // 调用模板数据渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr)
                // 通过layui重新渲染表单区域的ui结构
                form.render()
            }
        })
    }
    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询对象q对应属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新筛选条件重新渲染表格数据
        initTable();
    })
    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render()渲染分页结构
        laypage.render({
            elem: 'pageBox', //注意，这里的是 ID，不用加 # 号  F分页容器的ID
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示的条数
            curr: q.pagenum, //指定默认选中的页数
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], //每页选择条数的选项
            // 切换页数的时候触发JUMP回调
            // 触发回调方式:
            // 1.点击页码触发
            // 2.调用了laypage.render()方法   (死循环原因)
            jump: function (obj, first) {
                // obj.curr 得到当前页
                q.pagenum = obj.curr
                // 把最新的条目数赋值到q.pagesize
                // obj.limit 得到每页显示的条数
                q.pagesize = obj.limit
                // 根据最新的q获取对应的数据列表并渲染
                // initTable();在这里直接调用会死循环

                //首次不执行
                if (!first) {
                    initTable() //通过first判断通过哪种方式触发 true:方式2 否则方式1
                }
            }

        });
    }

    // 代理形势为删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function() {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        console.log(len)
        // 获取到文章的 id
        var id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
          $.ajax({
            method: 'GET',
            url: '/my/article/delete/' + id,
            success: function(res) {
              if (res.status !== 0) {
                return layer.msg('删除文章失败！')
              }
              layer.msg('删除文章成功！')
              // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
              // 如果没有剩余的数据了,则让页码值 -1 之后,
              // 再重新调用 initTable 方法
              // 4
              if (len === 1) {
                // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                // 页码值最小必须是 1
                q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
              }
              initTable()
            }
          })
    
          layer.close(index)
        })
      })
})