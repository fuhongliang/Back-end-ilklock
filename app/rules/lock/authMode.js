'use strict';

module.exports = {
  mode_id:{
    type: 'integer',
    min: 1,
    required: true,
    transform(value) {
      if ('string' === typeof value){
        value = parseInt(value);
      }
      return value;
    },
    message: '开锁模式ID为空',
  },
  user_id: {
    type: 'integer',
    min: 1,
    required: true,
    transform(value) {
      if ('string' === typeof value){
        value = parseInt(value);
      }
      return value;
    },
    message: '请选择用户',
  },
  start_time: {
    type: 'string',
    message: '开锁开始时间格式错误',
  },
  end_time: {
    type: 'string',
    required: true,
    message: '请选择开锁结束时间',
  },
};
