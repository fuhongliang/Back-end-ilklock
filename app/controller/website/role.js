'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class RoleController extends BaseController {
  async list() {
    const { ctx } = this;
    await ctx.render('role/list');
  }

}

module.exports = RoleController;
