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

// 提交数据
function submit(url,method,data){
  $.ajax({
    url,
    method,
    data,
    success: function(res){
      if (res.code === 0){
        layer.msg(res.msg,{ time: 1000 },function() {
          window.location.reload();
        });
      }else{
        layer.msg(res.msg);
      }
    },
    error: function() {
      layer.msg('服务器异常');
    }
  });
}

// 点击关闭下拉框
$(document).on('click','body',function(){
  $('.dropdown').hide();
});

// 全选/全不选
$(document).on('click','#ck-all',function(){

  if ($(this).prop('checked')){
    $('.ck-item').prop('checked',true);
  }else{
    $('.ck-item').prop('checked',false);
  }
  // document.getElementsByClassName('.ck-item').dispatchEvent(new Event('onclick'));
  $('.ck-item').each(function(){
    $(this)[0].dispatchEvent(new Event('change'));
  });
});
$(document).on('click','.ck-item',function() {
  if (!$(this).prop('checked')){
    $('#ck-all').prop('checked',false);
  }
});

// 将对象转成query (name=123&id=1)
function objToUrl(obj = {}){
  let params = '?';
  for (let key in obj){
    if (obj.hasOwnProperty(key)){
      params += `${key}=${obj[key]}&`;
    }
  }
  return params.slice(0,-1);
}

// 退出登录
$(document).on('click','.logout',function(){
  let that = $(this);
  layer.confirm('退出登录?',function(index){
    //do something
    window.location.href = that.attr('data-url');
    layer.close(index);
  });
});
