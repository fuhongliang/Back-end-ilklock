'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class RoleController extends BaseController {

  async list() {
    const { ctx } = this;
    const { role } = ctx.service;
    const list = await role.listRole();
    const permission_list = await ctx.helper.getAllPermisstion();
    await ctx.render('role/list',{ list: JSON.stringify(list), permission_list: JSON.stringify(permission_list)});
  }

  async del() {
    const { ctx, app } = this;
    const { Role } = app.model;
    const { id } = ctx.request.body;
    const user = app.userInfo;
    await Role.update({ is_delete: 1},{ where: { id, com_id: user.com_id}});
    ctx.body = {
      code: 0,
      msg: '删除成功'
    }
  }

  async edit() {
    const { ctx, app } = this;
    const { role } = ctx.service;

    const validateResult = await ctx.validate('role.edit',ctx.request.body);

    if (!validateResult){
      return ;
    }
    ctx.body = await role.edit();

  }

}

module.exports = RoleController;
