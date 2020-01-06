'use strict';

module.exports = {
  region_name: [
    { type: 'string', message: '锁名称必须字符串'},
    { required: true, message: '锁名称不能为空'},
    { min: 1, message: '名称长度必须1-50字符' },
    { max: 50, message: '名称长度必须1-50字符' },
  ],
  parent_id: [
    { pattern: /^\d+/, message: '锁id为整数' },
    {required: true, message: '锁不能为空' }
  ],
  region_id: {
    type: 'integer',
    min: 1,
    transform(value) {
      if ('string' === typeof value){
        value = parseInt(value);
      }
      return value;
    },
    message: '编辑区域id不存在',
  },
};
