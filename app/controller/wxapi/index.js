'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class IndexController extends BaseController {
  async index(){
    const { ctx } = this;
    ctx.body = ctx.session.account;
  }
}

module.exports = IndexController;
