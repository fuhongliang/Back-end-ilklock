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
  duration: {
    type: 'integer',
    min: 1,
    transform(value) {
      if ('string' === typeof value){
        value = parseInt(value);
      }
      return value;
    },
    message: '请选择时长',
  },
};
