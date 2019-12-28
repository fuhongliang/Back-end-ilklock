'use strict';

module.exports = {
  name: [
    { type: 'string', message: '锁名称必须字符串'},
    { require: true, message: '锁名称不能为空'}
  ],
  id: [
    { type: 'number', message: '地区id为整数' },
    {require: true, message: '选择地区不能为空' }
  ],
};
