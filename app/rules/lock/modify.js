'use strict';

module.exports = {
  name: [
    { type: 'string', message: '锁名称必须字符串'},
    { required: true, message: '锁名称不能为空'},
    { min: 3, message: '名称长度必须3-15字符' },
    { max: 15, message: '名称长度必须3-15字符' },
  ],
  id: [
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
    message: '请选择地区',
  },
};
