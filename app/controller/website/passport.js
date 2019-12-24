'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class PassportController extends BaseController {
  async login() {
    const { ctx } = this;
    await ctx.render('passport/login');
  }
}

module.exports = PassportController;
