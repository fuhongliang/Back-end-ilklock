'use strict';

module.exports = {
  account: [
    { type: 'string', message: '账号不能为空' },
    { required: true, message: '账号不能为空' },
    { min: 6, message: '账号长度必须6-15字符' },
    { max: 15, message: '账号长度必须6-15字符' },
  ],
  password: [
    { type: 'string', message: '请输入密码' },
    { required: true, message: '请输入密码' },
    { min: 6, message: '密码长度至少6位' },
  ],
  com_name: [
    { type: 'string', message: '企业名称必须字符串' },
    { required: true, message: '企业名称不能为空' },
    { min: 3, message: '企业长度必须3-25字符' },
    { max: 25, message: '企业长度必须3-25字符' },
  ],
  address: [
    { type: 'string', message: '企业地址不能为空' },
    { required: true, message: '企业地址不能为空' },
  ],
  name: [
    { type: 'string', message: '企业联系人不能为空' },
    { required: true, message: '企业联系人不能为空' },
  ],
  phone: [
    { type: 'string', message: '企业联系人电话不能为空' },
    { required: true, message: '企业联系人电话不能为空' },
    { pattern: /^(1[3|4|5|8]\d{9})$/, message: '电话格式错误'}
  ],
};
