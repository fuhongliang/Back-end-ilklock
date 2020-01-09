'use strict';

module.exports = {
  job_no: {
    type: 'string',
    required: true,
    whitespace: true,
    message: '职工号不能为空'
  },
  name: {
    type: 'string',
    required: true,
    min: 2,
    max: 25,
    message: '名字必须是2-25字符长度的字符串'
  },
  pinyin: {
    type: 'string',
    required: true,
    whitespace: true,
    message: '姓名拼音不能为空'
  },
  phone: {
    type: 'string',
    required: true,
    pattern: /^1[3|4|5|8][0-9]\d{4,8}$/,
    message: '手机号格式错误'
  },
  role_id: {
    required: true,
    pattern: /^\d+$/,
    message: '请选择用户角色'
  }
};
