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
  },

  /**
   * 检测用户是否有权限
   * @param id
   * @param type = { qygl: '区域管理', qysz: '区域设置', kssq: '开锁授权', ckjl: '查看记录', rygl: '人员管理', jsgl: '角色管理', kssz: '开锁设置' }
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

  getHost() {
    const { ctx } = this;
    return ctx.request.protocol + '://' + ctx.request.host;
  }
};
