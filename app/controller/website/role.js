'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class RoleController extends BaseController {
  async list() {
    const { ctx } = this;
    const { role } = ctx.service;
    const list = await role.listRole();
    await ctx.render('role/list',{ list: JSON.stringify(list)});
  }

  async del() {
    const { ctx, app } = this;
    const { Role } = app.model;
    const { id } = ctx.request.body;
    const user = app.userInfo;
    const res = await Role.update({ is_delete: 0},{ where: { id, com_id: user.com_id}});
    if (res[0] === 0){
      ctx.body = {
        code: 1,
        msg: '删除失败'
      }
    }else{
      ctx.body = {
        code: 0,
        msg: '删除成功'
      }
    }
  }

}

module.exports = RoleController;
