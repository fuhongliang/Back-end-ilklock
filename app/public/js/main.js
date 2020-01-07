// 取消按钮关闭layer弹出层
$(document).on('click','.layer-btn-cancel',function(){
  layer.close($(this).attr('layer-index'));
});

// 删除
$(document).on('click','.del',function(){
  let url = $(this).attr('data-url');
  let id = $(this).attr('data-id');
  layer.confirm('确定删除?',function(index){
    $.ajax({
      url: url,
      type: 'post',
      data: {
        id,
        _csrf,
      },
      success: function(res){
        if (res.code === 0){
          layer.msg('删除成功',{time: 1500},function(){
            window.location.reload();
          });
        }else{
          layer.msg(res.msg);
        }
      },
      error: function() {
        layer.msg('删除失败');
      }
    });
    layer.close(index);
  });
});

// 保存
$(document).on('click','.save',function(){
  let form = $(this).closest('form');
  $.ajax({
    url: form.attr('action'),
    type: form.attr('method'),
    data: form.serialize(),
    success: function(res){
      if (res.code === 0){
        layer.msg('保存成功',{time: 1500},function(){
          let returnUrl = form.attr('return-url');
          if (returnUrl){
            window.location.href = returnUrl;
          }else{
            window.location.reload();
          }
        });
      }else{
        layer.msg(res.msg);
      }
    },
    error: function(){
      layer.msg('服务器异常,请稍后尝试~');
    }
  });
});
