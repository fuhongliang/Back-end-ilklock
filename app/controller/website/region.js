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

  async setting() {
    const { ctx } = this;
    await ctx.render('region/setting');
  }
}

module.exports = AgentController;
