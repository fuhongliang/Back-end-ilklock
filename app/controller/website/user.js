'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class UserController extends BaseController {
  async index() {
    const { ctx } = this;
    await ctx.render('user/index');
  }
}

module.exports = UserController;
