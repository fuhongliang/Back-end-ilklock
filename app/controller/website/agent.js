'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class AgentController extends BaseController {
  async locks() {
    const { ctx } = this;
    await ctx.render('agent/locks');
  }

  async setting() {
    const { ctx } = this;
    await ctx.render('agent/setting');
  }
}

module.exports = AgentController;
