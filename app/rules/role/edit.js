'use strict';

module.exports = {
  permission_ids: [
    { type: 'array', message: '权限必须数组'},
  ],
  role_name: [
    { type: 'string', message: '角色名称不能为空' },
    { required: true, message: '角色名称不能为空' },
    { min: 1, message: '角色名称长度小于25'},
    { max: 25, message: '角色名称长度小于25'},
  ],
  desc: [
    { type: 'string', message: '角色描述不能为空' },
    { required: true, message: '角色描述不能为空' },
  ],
};
