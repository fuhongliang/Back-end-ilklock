'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class ApplyController extends BaseController {

  async getKeys(){
    const { ctx } = this;
    ctx.body = await ctx.service.apply.getAuthKeys();
  }

  async getAuditer() {
    
  }
}

module.exports = ApplyController;
