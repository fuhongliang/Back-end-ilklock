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

  async applyKeySecret(){

  }


}

module.exports = ApplyController;
