'use strict';

module.exports = {
  lock_no: [
    { type: 'string', message: '锁ID必须字符串' },
    { required: true, message: '锁ID不能为空' },
  ],
  lock_name: [
    { type: 'string', message: '锁名称必须字符串' },
    { required: true, message: '锁名称不能为空' },
    { min: 3, message: '名称长度必须3-15字符' },
    { max: 15, message: '名称长度必须3-15字符' },
  ],
  region_id: [
    { required: true, message: '选择地区不能为空' },
    { pattern: /^\d+/, message: '地区id为整数' }
  ],
};
