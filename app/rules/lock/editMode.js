'use strict';

module.exports = {
  name:{
    type: 'string',
    min: 1,
    required: true,
    message: '开锁模式名称不能为空',
  },
  desc: {
    type: 'string',
    min: 1,
    max: 1000,
    required: true,
    message: '描述必须1~1000字符内',
  },
  locks_id: {
    type: 'array',
    message: '请添加锁',
  },
};
