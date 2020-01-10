'use strict';

const menuList = [
  {
    name: '区域管理',
    icon: 'icon-quyuguanli1',
    url: '/web/locks',
    is_show: true,
    children: [
      {
        name: '锁管理',
        url: '/web/locks',
        is_show: true,
      },
      {
        name: '区域设置',
        url: '/web/region',
        is_show: true,
        sub: [
          {
            name: '添加区域',
            url: '/web/add_region',
            is_show: false
          }
        ],
      }
    ],
  },
  {
    name: '申请记录',
    icon: 'icon-shenqingkaiban',
    url: '/web/list_apply',
    is_show: true
  },
  {
    name: '角色管理',
    icon: 'icon-rrenyuanguanli-',
    url: '/web/roles',
    is_show: true
  },
  {
    name: '人员管理',
    icon: 'icon-jiaoseguanli',
    url: '/web/users',
    is_show: true
  },
  {
    name: '操作记录',
    icon: 'icon-jiudianguanlihoutai-kaisuojilu',
    url: '/web/operate_list',
    is_show: true
  },
  {
    name: '开锁模式',
    icon: 'icon-beijingjingwu_chaxun_kaisuojigongchaxun',
    url: '/web/mode_locks',
    is_show: true,
  }
];

module.exports = {
  getMenuList(){
    return menuList;
  }
};
