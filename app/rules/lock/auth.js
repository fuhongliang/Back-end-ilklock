'use strict';

module.exports = {
  lock_id:{
    type: 'integer',
    min: 1,
    required: true,
    transform(value) {
      if ('string' === typeof value){
        value = parseInt(value);
      }
      return value;
    },
    message: '锁ID为空',
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
    required: true,
    transform(value) {
      if ('string' === typeof value){
        value = parseInt(value);
      }
      return value;
    },
    message: '请选择时长',
  },
};
