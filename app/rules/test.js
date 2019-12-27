'use strict';

module.exports = {
  username: [
    { required: true, message: '邮箱不能为空' },
    { type: 'string', message: '参数是字符串'}
  ]
};
