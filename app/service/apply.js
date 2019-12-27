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
    const user = app.cache.get(access_token + '-user-' + user_id);
    const { ApplyAuthorize, Lock, Group } = app.model;

    let list = await ApplyAuthorize.findAll({
      where: {
        user_id: user.id,
        expiry_time: { $gt: new Date().getTime() },
        status: 1,
        is_delete: 0
      },
      attributes: ['id', 'secret_key', 'expiry_time'],
      include: [
        {
          model: Lock,
          as: 'lock',
          where: {
            is_delete: 0
          },
          attributes: ['name'],
          required: false
        },
        {
          model: Group,
          as: 'work',
          where: {
            is_delete: 0
          },
          attributes: ['name'],
          required: false
        }

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
    const user = app.cache.get(access_token + '-user-' + user_id);

    return User.findAll({
      where: {
        mch_id: user.mch_id,
        is_delete: 0,
        is_check: 1,
        id: {
          $ne: 3
        },
        level: {
          $gt: 0
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

  async getRecordByUserId(id){
    const { ctx } = this;
    const { ApplyAuthorize, Lock, Group } = ctx.model;
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
        {
          model: Group,
          attributes: [ ['id', 'group_id'], ['name', 'gname'] ],
          where: {
            is_delete: 0
          }
        },
      ],
      order: [ ['addtime', 'DESC'] ],
    });
  }
}

module.exports = ApplyService;
