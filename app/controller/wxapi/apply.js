'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class ApplyController extends BaseController {

  // 获取授权秘钥
  async getKeys(){
    const { ctx } = this;
    ctx.body = await ctx.service.apply.getAuthKeys();
  }

  /**
   * 获取审批人
   * @returns {Promise<void>}
   * type { nl: '新增锁', ol: '申请开锁' }
   */
  async getAuditer() {
    const { ctx, app } = this;
    const { User, Role } = ctx.model;
    const { access_token, type } = ctx.request.body;
    const user = app.cache.get(access_token + '-user');
    const Op = app.Sequelize.Op;
    let list = User.findAll({
      where: {
        mch_id: user.mch_id,
        is_delete: 0,
        id: {
          [Op.ne]: user.id
        },
      },
      include: [
        {
          model: 'Role',
          attributes: [ ['name', 'role_name'] ],
        }
      ],
      attributes: ['id', 'name'],
    });

    ctx.body = {
      code: 0,
      msg: 'success',
      data: {
        list: list ? list.toJSON() : []
      }
    }
  }

  async getRecords() {
    const { ctx, app } = this;
    const { apply } = ctx.service;
    const { access_token } = ctx.request.body;
    const user = app.cache.get(access_token + '-user');
    ctx.body = {
      code: 0,
      msg: 'success',
      data: {
        records: await apply.getRecordByUserId(user.id)
      }
    }
  }
}

module.exports = ApplyController;
