'use strict';

const path=require('path');
const Controller = require('egg').Controller;
const wx = require('wx-minprogram');
const assert = require('assert');

class HomeController extends Controller {
  async index() {
    const { ctx ,app } = this;
    const { Admin,User,WechatApp } = ctx.model;

    ctx.body = {

    };
  }
  async test(){
    const { ctx, app } = this;
    const { Admin,User,WechatApp } = ctx.model;
    const { lock, apply } = ctx.service;

    const { id = 1 , page = 1, page_size = 10 } = ctx.request.body;
    const user = await User.findOne();
    // assert(id,'参数id不能为空');
    app.user = user;

    ctx.body = {
      utl: ctx.path,
      reg: '/dd/api'.search(/^\/api/),
      json: JSON.stringify({id: 11}),
      // id: id
    };
  }
}

module.exports = HomeController;
