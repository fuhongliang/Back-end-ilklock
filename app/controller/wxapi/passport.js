'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));
const wx = require('wx-minprogram');
const assert = require('assert');


class passportController extends BaseController {

  async login() {
    const { ctx } = this;

    const validateResult = await ctx.validate('login',ctx.request.body);

    if (!validateResult){
      return ;
    }

    const { passport } = ctx.service;


    ctx.body = await passport.login();

  }

  async binding(){
    const { ctx, app } = this;
    const { phone, code, access_token } = ctx.request.body;
    const { WxAccount,User } = ctx.model;


    ctx.body = {
      code: 1000,
      msg: '绑定失败',
    };
  }

  async apply(){
    const { user } = this.ctx.service;
    return user.register();
  }
}

module.exports = passportController;
