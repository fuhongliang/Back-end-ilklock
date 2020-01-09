'use strict';

const path = require('path');

const Service = require(path.join(process.cwd(),'app/service/baseService'));
const crypto = require('crypto');
const field = ['job_no','name','pinyin','phone'];

class UserService extends  Service{

  async importUser(file) {
    const { ctx, app } = this;
    const excel = require(path.join(process.cwd(),'app/util/excel'));
    const data = await excel.readFile(field,file);
    console.log(data);
    const user = app.userInfo;
    const { User } = app.model;

    for (let key in data){
      if (data.hasOwnProperty(key)){
        data[key].com_id = user.com_id;
        data[key].username = data[key].phone;
        data[key].password = crypto.createHash('sha1').update(data[key].pinyin).digest('hex');
        data[key].avatar = ctx.helper.getDefaultAvatar();
        data[key].level = 1;
        data[key].is_check = 1;
        data[key].addtime = Date.now();
      }
    }
    await User.bulkCreate(data);
  }
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

  async listUser(options = {}) {
    const { app } = this;
    const { User, Role } = app.model;
    const user = app.userInfo;

    let where = {
      com_id: user.com_id,
      id: { [app.Sequelize.Op.ne]: user.id },
      is_delete: 0,
      level: 1,
    };
    for (let key in options){
      where[key] = options[key];
    }

    return User.findAll({
      where,
      include: [
        {
          model: Role,
          as: 'role',
          attributes: []
        }
      ],
      attributes: ['id', 'name', 'avatar', 'job_no', 'pinyin', 'phone', [app.Sequelize.col('role.name'), 'role_name'], [app.Sequelize.col('role.id'), 'role_id']],
    });
  }

  /**
   * 编辑用户
   * @returns {Promise<{msg: string, code: number}>}
   */
  async edit() {
    const { ctx, app } = this;
    const { User } = app.model;
    const { user_id, job_no, name, pinyin, phone, role_id } = ctx.request.body;
    const user = app.userInfo;

    if (user_id){
      await User.update({ job_no, name, pinyin, phone, roleid: role_id },{ where: { id: user_id, com_id: user.com_id } });
    }else{
      await User.create({
        com_id: user.com_id,
        name,
        job_no,
        pinyin,
        phone,
        roleid: role_id,
        addtime: new Date().getTime(),
        avatar: ctx.helper.getDefaultAvatar(),
        level: 1,
        is_check: 1,
        username: phone,
        password: crypto.createHash('sha1').update(pinyin).digest('hex'),
      })
    }

    return {
      code: 0,
      msg: 'success'
    }
  }

  /**
   * 批量授权角色
   * @returns {Promise<void>}
   */
  async authPatch() {
    const { ctx, app } = this;
    const { role_id, user_ids } = ctx.request.body;
    const { User } = app.model;
    const user = app.userInfo;

    await User.update({ roleid: role_id },{ where: { id: { [app.Sequelize.Op.in]: user_ids } } });
    return {
      code: 0,
      msg: 'success'
    }
  }
}

module.exports = UserService;
