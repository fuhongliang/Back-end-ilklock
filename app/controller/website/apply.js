'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class ApplyController extends BaseController {
  async list() {
    const { ctx } = this;
    await ctx.render('apply/list');
  }

}

module.exports = ApplyController;
