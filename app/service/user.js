'use strict';

const path = require('path');

const Service = require(path.join(process.cwd(),'app/service/baseService'));

class UserService extends  Service{

  /*
  async register(){
    const { ctx ,app } = this;
    const { WxAccount,User } = ctx.model;
    const createRule = {
      com_id: { type: 'int', require: true },
      username: { type: 'int', require: true },
      name: { type: 'string', require: true },
      pinyin: { type: 'string', require: true },
      phone: { type: 'string', require: true },
    };

    let info = ctx.session.phoneCode;
    let data = ctx.request.body;
    data.phone = info.phone ? info.phone : data.phone;
    if (!data.username){
      data.username = data.phone;
    }

    let err = app.validator.validate(createRule,data);
    if (err){
      return;
    }
    let user = User.findOne({
      where: {
        [app.Sequelize.Op.or]: [
          {username: data.username},
          {phone: data.phone},
        ]
      }
    });

    if (user){
      return {
        code: 1,
        msg: '手机号或用户账号已存在'
      }
    }
    data.level = 1;
    data.time = new Date().getTime();
    data.is_check = 0;
    try{
      user = await User.create(data);
    } catch (err){
      ctx.logger.warn('用户申请失败' . err);
    }

    if (user){
      let account = ctx.session.account;
      let res = await WxAccount.update({user_id: user.id},{where: {openid: account.openid, unionid: account.unionid}});
      if (res){
        return {
          code: 0,
          msg: '账号申请成功'
        }
      }
    }
    return {
      code: 1,
      msg: '账号绑定失败'
    };
  }
   */

  async listUser() {
    const { app } = this;
    const { User, Role } = app.model;
    const user = app.userInfo;
    return User.findAll({
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
  }
}

module.exports = UserService;
