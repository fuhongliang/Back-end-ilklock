// app/extend/helper.js

const path = require('path');

module.exports = {

  /**
   * 菜单
   * @returns {string}
   */
  getMenu() {
    const { ctx } = this;
    const menu_list = require(path.join(process.cwd(), 'app/controller/website/menu'));
    this.activeMenu(menu_list,ctx.path,0,[]);
    return JSON.stringify(menu_list);

    // this 是 helper 对象，在其中可以调用其他 helper 方法
    // this.ctx => context 对象
    // this.app => application 对象
  },

  getAdminMenu() {
    const { ctx } = this;
    let menu_list = require(path.join(process.cwd(), 'app/controller/webadmin/menu'));
    this.activeMenu(menu_list,ctx.path,0,[]);
    return JSON.stringify(menu_list);

    // this 是 helper 对象，在其中可以调用其他 helper 方法
    // this.ctx => context 对象
    // this.app => application 对象
  },

  activeMenu(menu_list, route,level = 0, parents){

    for (let i in menu_list) {
      if (menu_list.hasOwnProperty(i)){
        menu_list[i].is_active = false;
        if (menu_list[i].url === route) {
          menu_list[i].is_active = true;
        }else if (menu_list[i].sub && Array.isArray(menu_list[i].sub)){
          for (let sub of menu_list[i].sub){
            if (sub.url === route){
              menu_list[i].is_active = true;
            }
          }
        }
        if (menu_list[i].is_active){
          for (let p of parents){
            p.is_active = true;
          }
        }
        if (menu_list[i].children && Array.isArray(menu_list[i].children)){
          let p = parents;
          if (level === 0){
            p = [];
          }
          p.push(menu_list[i]);
          level++;
          this.activeMenu(menu_list[i].children,route,level,p);
        }
      }
    }
  },

  async getAllPermisstion() {
    console.log(this.ctx.path);
    return this.app.model.Permission.findAll();
  },

  /**
   * 检测用户是否有权限
   * @param id
   * @param type = { qygl: '区域管理', qysz: '区域设置', kssq: '开锁授权', ckjl: '查看记录', rygl: '人员管理', jsgl: '角色管理', kssz: '开锁设置', 'lxsq': '离线授权' }
   */
  async isPermission(id, type) {
    const { Permission, User } = this.app.model;

    const p = await User.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: Permission,
          as: 'up',
          where: {
            alias_name: type
          },
          require: true
        }
      ],
    });

    if (!p){
      return false;
    }
    return true;
  },

  /**
   *
   * @param value
   * @param arr
   * @returns {boolean}
   */
  inArray(value,arr){
    for (let val of arr){
      if (val == value){
        return true;
      }
    }
    return false;
  },

  /**
   *
   * @param buf
   * @param bitOffset
   * @param length
   * @returns {number}
   */
  readInt(buf, bitOffset, length) {
    let readOffset = bitOffset;
    let result = 0;
    for (let i = 0; i < length; i++) {
      const bytePos = Math.floor(readOffset / 8);
      const bitPos = 7 - (readOffset % 8);
      const byte = buf.readUInt8(bytePos);
      const bit = (byte >> bitPos) & 1;

      result |= bit << (length - i - 1);
      readOffset++;
    }

    return result;
  },

  /**
   * 获取域名地址
   * @returns {string}
   */
  getHost() {
    const { ctx } = this;
    return '//' + ctx.request.host;
  },

  /**
   * 默认头像
   * @returns {string}
   */
  getDefaultAvatar() {
    const host = this.getHost();
    return `${host}/static/images/avatar/avatar-0${Math.ceil(Math.random() * 9)}.jpg`;
  },

  createUrl(path = '',options = {}) {
    let param = '';
    for (let key in options){
      if (options.hasOwnProperty(key)){
        param += `${key}=${options[key]}&`
      }

    }
    param = param.slice(0,-1);
    if (!/^\//.test(path)){
      path = '/' + path;
    }
    if (param){
      path += `?${param}`;
    }
    return this.getHost() + path;
  },

};
