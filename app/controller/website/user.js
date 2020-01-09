'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class UserController extends BaseController {
  async index() {
    const { ctx, app } = this;
    const { user, role } = ctx.service;
    const query = ctx.query;
    let where = {};
    for (let q in query){
      if (query.hasOwnProperty(q) && ['roleid', 'name', 'phone'].includes(q)){
        if (q === 'phone' || q === 'name'){
          where[q] = { [app.Sequelize.Op.like]: `%${query[q]}%` }
        }else{
          where[q] = query[q];
        }
      }
    }
    const list = await user.listUser(where);
    const list_role = await role.listRole();
    await ctx.render('user/index',{ list: JSON.stringify(list), list_role: JSON.stringify(list_role), query });
  }

  async listUser() {
    const { ctx } = this;
    const { user } = ctx.service;
    const list = await user.listUser({ is_check: 1 });

    ctx.body = {
      code: 0,
      msg: 'success',
      data: {
        list
      }
    }
  }

  async edit() {
    const { ctx } = this;
    const { user } = ctx.service;

    const validateResult = await ctx.validate('user.edit',ctx.request.body);
    if (!validateResult){
      return ;
    }

    ctx.body = await user.edit();
  }

  async del() {
    const { ctx, app } = this;
    const { id } = ctx.request.body;
    const { User } = app.model;
    const user = app.userInfo;
    await User.update({ is_delete: 1},{ where: { id, com_id: user.com_id }});
    ctx.body = {
      code: 0,
      msg: 'success'
    }
  }

  async authPatch() {
    const { ctx } = this;
    const { user } = ctx.service;

    const validateResult = await ctx.validate('user.patch',ctx.request.body);
    if (!validateResult){
      return ;
    }
    ctx.body = await user.authPatch();

  }
}

module.exports = UserController;
