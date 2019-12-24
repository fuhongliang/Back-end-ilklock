'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class HomeController extends BaseController {
  async index() {
    const { ctx } = this;
    await ctx.render('home');
  }
}

module.exports = HomeController;
