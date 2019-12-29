'use strict';

module.exports = {
  locks: [
    { type: 'array', message: '锁必须是个数组' },
    { required: true, message: '请选择锁' },
    { min: 1, message: '请选择锁'}
  ],
  audit_id: [
    { pattern: /^\d+/, message: '审核人id为整数' },
    { required: true, message: '审核人不能为空'}
  ],
  duration: [
    { pattern: /^\d+/, message: '有效时长必须为整数' },
    { required: true, message: '有效时长不能为空'}
  ],
};
