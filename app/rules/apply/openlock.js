'use strict';

module.exports = {
  locks: [
    { type: 'array', message: '锁必须是个数组' },
    { require: true, message: '请选择锁' },
  ],
  audit_id: [
    { type: 'integer', message: '审核人id必须整数'},
    { require: true, message: '审核人不能为空'}
  ],
  duration: [
    { type: 'integer', message: '有效时长必须为整数'},
    { require: true, message: '有效时长不能为空'}
  ],
};
