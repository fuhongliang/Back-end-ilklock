'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class UserController extends BaseController {
  async index() {
    const { ctx } = this;
    await ctx.render('user/index');
  }

  async listUser() {
    const { ctx, app } = this;
    const { User, Role } = app.model;
    const user = app.userInfo;
    const list = await User.findAll({
      where: {
        com_id: user.com_id,
        id: {
          [app.Sequelize.Op.ne]: user.id
        },
        is_delete: 0,
        is_check: 1,
        level: 1
      },
      include: [
        {
          model: Role,
          as: 'role',
          attributes: []
        }
      ],
      attributes: ['id', 'name', 'avatar', [app.Sequelize.col('role.name'), 'role_name']],
    });
    ctx.body = {
      code: 0,
      msg: 'success',
      data: {
        list
      }
    }
  }
}

module.exports = UserController;
