'use strict';

module.exports = {
  lock_no: [
    { type: 'string', message: '锁ID必须字符串' },
    { require: true, message: '锁ID不能为空' },
  ],
  lock_name: [
    { type: 'string', message: '锁名称必须字符串'},
    { require: true, message: '锁名称不能为空'}
  ],
  region_id: [
    { type: 'integer', message: '地区id为整数' },
    {require: true, message: '选择地区不能为空' }
  ],
};
