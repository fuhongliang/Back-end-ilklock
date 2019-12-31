'use strict';

const path = require('path');
const Service = require(path.join(process.cwd(),'app/service/baseService'));

class ApplyService extends Service{

  /**
   * 获取已授权钥匙
   * @returns {Promise<{msg: string, code: number, data: {list: *}}>}
   */
  async getAuthKeys(){
    const { app } = this;
    const { access_token, user_id } = this.ctx.request.body;
    const user = app.userInfo;
    const { ApplyAuthorize, Lock } = app.model;

    let list = await ApplyAuthorize.findAll({
      where: {
        user_id: user.id,
        expiry_time: { [app.Sequelize.Op.gt]: new Date().getTime() },
        status: 1,
        is_delete: 0
      },
      attributes: ['id', 'secret_key', 'expiry_time', [app.Sequelize.col('lock.name') , 'lock_name'] ],
      include: [
        {
          model: Lock,
          as: 'lock',
          where: {
            is_delete: 0
          },
          attributes: [],
          required: false
        },
      ],
    });
    return {
      code: 0,
      msg: 'success',
      data: {
        list
      }
    }
  }

  /**
   * type { nl: '新增锁', ol: '申请开锁' }
   * @returns {Promise<void>}
   */
  async getAuditer(){
    const { ctx, app } = this;
    const { User, Role, Permission } = ctx.model;
    const { access_token, type, user_id } = ctx.request.body;
    let permission_id = 0;
    if ( type === 'nl'){
      permission_id = 1;
    }else if(type === 'ol'){
      permission_id = 3;
    }
    const user = app.userInfo;

    return User.findAll({
      where: {
        com_id: user.com_id,
        is_delete: 0,
        is_check: 1,
        id: {
          [app.Sequelize.Op.ne]: 3
        },
        level: {
          [app.Sequelize.Op.gt]: 0
        }
      },
      include: [
        {
          model: Permission,
          as: 'up',
          attributes: [],
          where: {
            id: permission_id,
          }
        },
        {
          model: Role,
          as: 'role',
          attributes: [],
        },

      ],
      attributes: [['id', 'audit_id'], 'name', [app.Sequelize.col('role.name'), 'role_name']],
    });
    //
    // return list;
  }

  /**
   *
   * @param id
   * @param type = { 0: 待处理, 1:已处理, 2:已提交 3:已批准 4:未完成}
   * @returns {Bluebird<any[]>}
   */
  async getRecordByUserId(id, options){
    const { ctx, app } = this;
    const { ApplyAuthorize, Lock, Group } = ctx.model;
    const { page , page_size } = options;
    const Op = app.Sequelize.Op;

    return ApplyAuthorize.findAll({
      where: {
        user_id: user.id,
        is_delete: 0,
      },
      include: [
        {
          model: Lock,
          attributes: [ ['id', 'lock_id'], ['name', 'lock_name'] ],
          where: {
            is_delete: 0
          }
        },
      ],
      order: [ ['addtime', 'DESC'] ],
      offset: (page - 1)*page_size,
      limit: page_size
    });
  }

  async applyKeySecret(data){

    const { app, ctx } = this;
    const { Lock, ApplyAuthorize, LockMode } = app.model;
    const { lock_id, audit_id, com_id, user_id, duration } = data;

    let locks_open_by_one = await LockMode.findOne({
      where: { com_id, is_delete: 0, type: 0 },
      attributes: ['locks']
    });
    locks_open_by_one = locks_open_by_one['locks'] ? JSON.parse(locks_open_by_one['locks']):[];

    if ( !ctx.helper.inArray(lock_id,locks_open_by_one) ){
      throw new Error('锁不支持单个申请');
    }
    const checkLock = await Lock.findOne({ where: { com_id , id: lock_id, is_delete: 0 } });
    if (!checkLock){
      throw new Error('锁信息不存在');
    }
    let addtime = new Date().getTime();
    await ApplyAuthorize.create({ com_id, user_id, lock_id, audit_id, duration, addtime, type: 0 });
  }

}

module.exports = ApplyService;
