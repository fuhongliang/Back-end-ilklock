'use strict';

module.exports = {
  code: [
    { type: 'string', message: '小程序code必须字符串' },
    { required: true, message: '小程序code不能为空' },
  ],
  encryptedData: [
    { type: 'string', message: '参数encryptedData必须字符串'},
    { required: true, message: '参数encryptedData不能为空'}
  ],
  iv: [
    { type: 'string', message: '参数iv必须字符串'},
    { required: true, message: '参数iv不能为空'}
  ],
  rawData: [
    { type: 'string', message: '参数rawData必须字符串'},
    { required: true, message: '参数rawData不能为空'}
  ],
  signature: [
    { type: 'string', message: '参数signature必须字符串'},
    { required: true, message: '参数signature不能为空'}
  ],
};
