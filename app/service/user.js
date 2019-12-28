'use strict';

const path = require('path');

const Service = require(path.join(process.cwd(),'app/service/baseService'));

class UserService extends  Service{

  /*
  async register(){
    const { ctx ,app } = this;
    const { WxAccount,User } = ctx.model;
    const createRule = {
      mch_id: { type: 'int', require: true },
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
}

module.exports = UserService;
