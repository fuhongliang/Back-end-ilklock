'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class AgentController extends BaseController {

  async getArea(){
    const { ctx } = this;
  }

  async listArea(){
    const { ctx } = this;
    ctx.body = await ctx.service.region.allArea();
  }
}

module.exports = AgentController;
