'use strict';

module.exports = {
  username: [
    { type: 'string', message: '用户名不能为空' },
    { required: true, message: '用户名不能为空' },
  ],
  password: [
    { type: 'string', message: '密码不能为空'},
    { required: true, message: '密码不能为空'},
  ],
  code: [
    { type: 'string', message: '验证码不能为空'},
    { required: true, message: '验证码不能为空'},
    { length: 5, message: '验证码错误'},
  ],
};
