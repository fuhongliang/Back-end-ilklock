// 取消按钮关闭layer弹出层
$(document).on('click','.layer-btn-cancel',function(){
  layer.close($(this).attr('layer-index'));
});
