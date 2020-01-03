'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class AgentController extends BaseController {
  async locks() {
    const { ctx, app } = this;
    const { region } = ctx.service;
    const list_region = await region.allArea(app.userInfo.com_id);
    await ctx.render('region/locks',{ list_region: JSON.stringify(list_region) });
  }

  async getLocks() {
    const { ctx, app } = this;
    const { lock } = ctx.service;
    const { region_id } = ctx.query;
    const list = await lock.getAreaLock(region_id);
    ctx.body = {
      code: 0,
      msg: 'success',
      data: {
        list
      }
    }
  }

  async getLockById() {
    const { ctx, app } = this;
    const { lock } = ctx.service;
  }

  async setting() {
    const { ctx } = this;
    await ctx.render('region/setting');
  }
}

module.exports = AgentController;
