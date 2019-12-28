'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));
const assert = require('assert');

class LockController extends BaseController {

  async getLockInfo(){
    const { ctx } = this;
    const { lock_no } = ctx.request.body;
    const { lock } = ctx.service;
    assert(lock_no,'锁编号不能为空');
    ctx.body = await lock.getLockByNo(lock_no);
  }

  async getAreaLock(){
    const { ctx } = this;
    const { lock } = ctx.service;
    let list = await lock.getAreaLock();
    ctx.body = {
      code: 0,
      msg: 'success',
      data: {
        list
      }
    }
  }

  async createLock(){
    const { ctx } = this;
    const { lock } = ctx.service;

    const validateResult = await ctx.validate('lock.create',ctx.request.body);

    if (!validateResult){
      return ;
    }

    ctx.body = await lock.create();
  }

  async modifyName(){
    const { ctx, app } = this;
    const { id, name, access_token, user_id } = ctx.request.body;

    const validateResult = await ctx.validate('lock.create',{ id, name });

    if (!validateResult){
      return ;
    }

    const { user } = app.cache.get(access_token + '-user-' + user_id);
    const { lock } = ctx.service;
    ctx.body = await lock.modify({ id, mch_id: user.mch_id },{ name });
  }
}

module.exports = LockController;
