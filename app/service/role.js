'use strict';

const path = require('path');
const Service = require(path.join(process.cwd(),'app/service/baseService'));
const sd = require('silly-datetime');

class RoleService extends Service{

  /**
   * 角色列表
   * @returns {Promise<[]>}
   */
  async listRole() {
    const { app } = this;
    const { Role, Permission } = app.model;
    const user = app.userInfo;
    const list = await Role.findAll({
      where: {
        com_id: user.com_id,
        is_delete: 0
      },
      include: [
        {
          model: Permission,
          as: 'perms',
          attributes: ['id', 'name'],
          through: {
            attributes: [],
          }
        }
      ],
      attributes: ['id', 'name', 'addtime', 'desc']
    });

    let new_list = [];
    for (let item of list){
      item.addtime = sd.format(new Date(),'YYYY-MM-DD HH:mm');
      new_list.push(item);
    }
    return new_list;
  }

  /**
   * 编辑角色
   * @returns {Promise<{msg: string, code: number}|boolean|{msg: *, code: number}>}
   */
  async edit() {
    const { ctx, app } = this;
    const { Role, PermissionRole } = app.model;
    const { role_id, role_name, desc, permission_ids } = ctx.request.body;
    const user = app.userInfo;

    let transaction;
    try {
      transaction = await ctx.model.transaction();
      const role = await Role.findOrCreate({ where: { id: role_id, com_id: 1 } , defaults:{ id: '',name: role_name, desc, addtime: new Date().getTime()} });

      if (role_id){
        await Role.update({ name: role_name, desc }, { where: { id: role_id, com_id: user.com_id } });
        await PermissionRole.destroy({where: { roleid : role_id, permissionid: { [app.Sequelize.Op.in]: permission_ids } } });
      }

      let prs = [];
      for (let permissionid of permission_ids){
        prs.push({
          roleid: role[0].id,
          permissionid
        });
      }
      await PermissionRole.bulkCreate(prs);
      await transaction.commit();

    } catch (e) {
      await transaction.rollback();
      this.logger.warn('角色编辑失败: ' + JSON.stringify(e));
      return {
        code: 1,
        msg: '失败了'
      };

    }

    return {
      code: 0,
      msg: 'success'
    }
  }

}

module.exports = RoleService;
