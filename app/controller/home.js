'use strict';

const path=require('path');
const Controller = require('egg').Controller;
const wx = require('wx-minprogram');
const assert = require('assert');
const crypto = require('crypto');


class HomeController extends Controller {
  async index() {
    const { ctx ,app } = this;
    const { Admin,User,WechatApp } = ctx.model;
    let str = JSON.stringify([2,3,4]);
    let arr = JSON.parse(str);
    arr.push('3');
    ctx.body = {
      test: /^1[3456789]\d{9}$/.test(undefined),
      a: ctx.helper.inArray(1,['1', 2]),
      str,
      arr: [...new Set(arr)]
    };
  }
  async test(){
    const { ctx, app } = this;
    const { Admin,User,WechatApp } = ctx.model;
    const { lock, apply } = ctx.service;
    const test = await app.cache.get('test');
    const { id = 1 , page = 1, page_size = 10 } = ctx.request.body;
    const user = await User.findOne();
    // assert(id,'参数id不能为空');
    app.user = user;

    ctx.body = {
      utl: ctx.path,
      reg: '/dd/api'.search(/^\/api/),
      json: JSON.stringify({id: 11}),
      test
      // id: id
    };
  }
}

module.exports = HomeController;
