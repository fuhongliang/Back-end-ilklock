'use strict';

module.exports =  [
  {
    name: '企业管理',
    icon: 'icon-qiye',
    url: '/web/admin/list_comp',
    is_show: true,
    sub: [
      {
        name: '添加企业',
        url: '/web/admin/add_comp',
        is_show: false
      }
    ],
  },
];
