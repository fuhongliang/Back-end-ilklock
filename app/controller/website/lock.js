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

    const validateResult = await ctx.validate('lock.authMode',ctx.request.body);
    if (!validateResult){
      return ;
    }

    ctx.body = await lock.authMode();
  }

  async authModeRecords() {
    const list = await this.ctx.service.lock.authModeRecords();

    await this.ctx.render('lock/auth_mode_records', { list: JSON.stringify(list.rows),count: list.count, page_size: list.pageSize,});
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
    await LockMode.update({ is_delete: 1},{ where: { id, com_id: user.com_id, type: 1 } });
    ctx.body = {
      code: 0,
      msg: '删除成功'
    }
  }

  async modeEdit() {
    const { ctx, app } = this;
    const { id = 0 } = ctx.query;
    const { lock, region } = ctx.service;
    const user = app.userInfo;

    if (ctx.method === 'POST'){
      const { lock } = ctx.service;
      const validateResult = await ctx.validate('lock.editMode',ctx.request.body);
      if (!validateResult){
        return ;
      }
      ctx.body = await lock.editMode(user,id);

    }else{
      let mode = await lock.getMode(user,id);
      let list_region = await region.allArea(user.com_id);

      const { locks = [] } = mode;
      await ctx.render('/lock/edit_mode', { mode: JSON.stringify(mode), locks: JSON.stringify(locks), list_region: JSON.stringify(list_region) });
    }

  }
}

module.exports = LockController;
