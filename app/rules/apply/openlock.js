'use strict';

module.exports = {
  locks: [
    { type: 'array', message: '锁必须是个数组' },
    { required: true, message: '请选择锁' },
  ],
  audit_id: [
    { pattern: /^\d+/, message: '审核人id为整数' },
    { required: true, message: '审核人不能为空'}
  ],
  duration: [
    { pattern: /^\d+/, message: '有效时长必须为整数' },
  ],
  start_time: [
    { type: 'string', message: '请选择开始时间' },
    { required: true, message: '请选择开始时间' },
  ],
  end_time: [
    { type: 'string', message: '请选择结束时间' },
    { required: true, message: '请选择结束时间' },
  ]
};
