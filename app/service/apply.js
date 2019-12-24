'use strict';

const path = require('path');
const Service = require(path.join(process.cwd(),'app/service/baseService'));

class ApplyService extends Service{

  async getAuthKeys(){
    const { app } = this;
    const { access_token, user_id } = this.ctx.request.body;
    const user = app.cache.get(access_token + '-user-' + user_id);
    const { ApplyAuthorize, Lock, Group } = app.model;
    const Op = app.Sequelize.Op;
    let list = await ApplyAuthorize.findAll({
      where: {
        user_id: user.id,
        expiry_time: { [Op.gt]: 0 },
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
