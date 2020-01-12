'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));
const assert = require('assert');

class LockController extends BaseController {
  async listMode() {
    const { ctx } = this;
    const { lock, user } = ctx.service;
    const list = await lock.listMode();
    const list_user = await user.getAllUser();
    await ctx.render('lock/mode', { list: JSON.stringify(list), list_user: JSON.stringify(list_user)});
  }

  /**
   * 授权作业
   * @returns {Promise<void>}
   */
  async authMode() {
    const { ctx } = this;
    const { lock } = ctx.service;

    const validateResult = await ctx.validate('lock.auth_mode',ctx.request.body);
    if (!validateResult){
      return ;
    }

    ctx.body = await lock.authMode();
  }

  /**
   * 删除作业模式
   * @returns {Promise<void>}
   */
  async modeDel() {
    const { ctx, app } = this;
    const { id } = ctx.request.body;
    assert(/^\d+$/.test(id),'删除失败');
    const { LockMode } = app.model;
    const user = app.userInfo;
    await LockMode.update({ is_delete: 1},{ where: { id, com_id: user.com_id } });
    ctx.body = {
      code: 0,
      msg: '删除成功'
    }
  }

  async modeEdit() {
    const { ctx, app } = this;
    if (ctx.method === 'POST'){

    }else{
      const { lock, region } = ctx.service;
      const { id = 0 } = ctx.query;
      const user = app.userInfo;
      let list_region = await region.allArea(user.com_id);
      let mode = await lock.getMode(id);

      const { locks = [], locks_id = [] } = mode;

      await ctx.render('/lock/edit_mode', { mode: JSON.stringify(mode), locks: JSON.stringify(locks), locks_id: JSON.stringify(locks_id), list_region: JSON.stringify(list_region) });
    }

  }
}

module.exports = LockController;
