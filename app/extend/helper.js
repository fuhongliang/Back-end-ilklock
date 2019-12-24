// app/extend/helper.js

const path = require('path');

module.exports = {
  getMenu() {
    const { ctx } = this;
    const menu = require(path.join(process.cwd(), 'app/controller/website/menu'));
    let menu_list = menu.getMenuList();
    for (let i in menu_list) {
      menu_list[i].is_active = false;
      if (menu_list[i].url === ctx.path) {
        menu_list[i].is_active = true;
      }
      if (menu_list[i].children && Array.isArray(menu_list[i].children)) {
        for (let ci in menu_list[i].children) {
          menu_list[i].children[ci].is_active = false;
          if (ctx.path === menu_list[i].children[ci].url) {
            menu_list[i].children[ci].is_active = true;
            menu_list[i].is_active = true;
          }
        }
      }
    }
    return JSON.stringify(menu_list);

    // this 是 helper 对象，在其中可以调用其他 helper 方法
    // this.ctx => context 对象
    // this.app => application 对象
  }
};
