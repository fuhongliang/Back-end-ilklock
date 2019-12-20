'use strict';

const Controller = require('./Controller');

class PassportController extends Controller {
  async login() {
    const { ctx } = this;
    await ctx.render('passport/login');
  }
}

module.exports = PassportController;
