'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));
const assert = require('assert');

class LockController extends BaseController {
  async getLockInfo(){
    const { ctx } = this;
    const { lock_no } = ctx.request.body;
    assert(lock_no,'锁编号不能为空');
    ctx.body = await ctx.service.lock.getLockByNo(lock_no);
  }

  async createLock(){
    const { ctx, app } = this;

    const createRule = {
      mch_id: { type: 'int', require: true },
      lock_no: { type: 'string', require: true },
      lock_name: { type: 'string', require: true },
      agent_id: { type: 'int', require: true },
    };

    let err = app.validator.validate(createRule,ctx.request.body);
    if (err){
      return;
    }
    ctx.body = await ctx.service.lock.create();

  }

  async modifyName(){
    const { ctx, app } = this;
    const { id, name } = ctx.request.body;
    const role = {
      id: { type: 'int', require: true },
      name: { type:'string', require: true }
    }

    ctx.body = await ctx.service.lock.modify(id,{ name });
  }
}

module.exports = LockController;
