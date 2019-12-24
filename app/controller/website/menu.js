'use strict';

const menuList = [
  {
    name: '区域管理',
    icon: 'icon-quyuguanli1',
    url: '/agent/locks',
    is_show: true,
    trig_icon: 'icon-triangle-copy-copy-copy',
    children: [
      {
        name: '锁管理',
        url: '/agent/locks',
        is_show: true,
      },
      {
        name: '区域设置',
        url: '/agent/setting',
        is_show: true,
      }
    ],
  },
  {
    name: '申请记录',
    icon: 'icon-shenqingkaiban',
    url: '/apply/list',
    is_show: true
  },
  {
    name: '角色管理',
    icon: 'icon-rrenyuanguanli-',
    url: '/role/list',
    is_show: true
  },
  {
    name: '人员管理',
    icon: 'icon-jiaoseguanli',
    url: '/users',
    is_show: true
  },
  {
    name: '操作记录',
    icon: 'icon-jiudianguanlihoutai-kaisuojilu',
    url: '/operate-list',
    is_show: true
  },
  {
    name: '开锁模式',
    icon: 'icon-beijingjingwu_chaxun_kaisuojigongchaxun',
    url: '/group/list',
    is_show: true,
    trig_icon: 'icon-triangle-right',
  }
];

module.exports = {
  getMenuList(){
    return menuList;
  }
};
