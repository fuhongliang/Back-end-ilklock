'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class ApplyController extends BaseController {

  // 获取授权秘钥
  async getKeys(){
    const { ctx } = this;
    ctx.body = await ctx.service.apply.getAuthKeys();
  }

  async renewStatus() {
    const { ctx, app } = this;
    const { locks } = ctx.request.body;
    const { apply } = ctx.service;
    if (Array.isArray(locks)){
      let trans;
      try {
        // 建立事务对象
        trans = await this.ctx.model.transaction();

        for (let lock of locks) {
          await apply.renewStatus(lock);
        }

        // 提交事务
        await trans.commit();
      } catch (err) {
        // 事务回滚
        await trans.rollback();
        ctx.body = {
          code: 1,
          msg: err
        };
        return ;
      }
      ctx.body = {
        code: 0,
        msg: 'success'
      };
      return ;
    }
    ctx.body = {
      code: 1,
      msg: '参数错误'
    };
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

  /**
   * 获取审批列表
   * @returns {Promise<void>}
   */
  async getRecords() {
    const { ctx, app } = this;
    const { apply } = ctx.service;
    const user = app.userInfo;
    const records = await apply.getRecordByUserId(user.id, ctx.request.body);
    ctx.body = {
      code: 0,
      msg: 'success',
      data: {
        records: records.rows,
        total_count: records.count
      }
    }
  }

  /**
   * 审批开锁申请
   * @returns {Promise<void>}
   */
  async authRecords() {
    this.ctx.body = await this.ctx.service.apply.review();
  }

  /**
   * 申请开锁
   * @returns {Promise<void>}
   */
  async applyKeySecret(){

    const { ctx, app } = this;
    const { User } = app.model;
    const { apply } = ctx.service;

    const validateResult = await ctx.validate('apply.openlock',ctx.request.body);
    if (!validateResult){
      return ;
    }
    const { locks, audit_id, duration = 0, start_time, end_time } = ctx.request.body;
    const user = app.userInfo;

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
        await apply.applyKeySecret({ lock_id, audit_id, com_id: user.com_id, user_id: user.id, duration, start_time, end_time });
      }

      // 提交事务
      await transaction.commit();
    } catch (err) {
      // 事务回滚
      await transaction.rollback();
      console.log(err);
      ctx.body = {
        code: 1,
        msg: err
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
