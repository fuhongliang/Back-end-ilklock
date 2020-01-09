'use strict';

module.exports = {
  user_ids: {
    type: 'array',
    required: true,
    min: 1,
    message: '请选择用户'
  },
  role_id: {
    required: true,
    pattern: /^\d+$/,
    message: '请选择用户角色'
  }
};
