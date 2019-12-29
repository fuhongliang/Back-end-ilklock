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
   */
  async getAuditer() {
    const { ctx } = this;
    const { apply } = ctx.service;
    ctx.body = {
      code: 0,
      msg: 'success',
      data: {
        list: await apply.getAuditer()
      }
    };
  }

  async getRecords() {
    const { ctx, app } = this;
    const { apply } = ctx.service;
    const { access_token, user_id, page = 1, page_size = 10 } = ctx.request.body;
    const user = app.cache.get(access_token + '-user-' + user_id);
    ctx.body = {
      code: 0,
      msg: 'success',
      data: {
        records: await apply.getRecordByUserId(user.id, { page, page_size })
      }
    }
  }

  async applyKeySecret(){

    const { ctx, app } = this;
    const { User } = app.model;
    const { apply } = ctx.service;
    const validateResult = await ctx.validate('apply.openlock',ctx.request.body);
    if (!validateResult){
      return ;
    }
    const { locks, audit_id, duration, access_token, user_id } = ctx.request.body;
    const user = app.cache.get(access_token + '-user-' + user_id);
    const checkAudit = User.findOne({ where: { id: audit_id, com_id: user.com_id }});
    if (!checkAudit || await ctx.helper.isPermission(audit_id,'kssq')){
      ctx.body = {
        code: 1,
        msg: '审核人不存在'
      }
    }

    let transaction;
    try {
      // 建立事务对象
      transaction = await this.ctx.model.transaction();

      for (let lock_id of locks) {
        await apply.applyKeySecret({ lock_id, audit_id, com_id: user.com_id, user_id, duration });
      }

      // 提交事务
      await transaction.commit();
    } catch (err) {
      // 事务回滚
      await transaction.rollback();
      ctx.body = {
        code: 1,
        msg: err,
      };
      return ;
    }

    ctx.body = {
      code: 0,
      msg: 'success'
    }

  }


}

module.exports = ApplyController;
