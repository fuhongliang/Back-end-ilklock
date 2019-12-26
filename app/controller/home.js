'use strict';

const path=require('path');
const Controller = require('egg').Controller;
const wx = require('wx-minprogram');
const assert = require('assert');

class HomeController extends Controller {
  async index() {
    const { ctx ,app } = this;
    const { Admin,User,WechatApp } = ctx.model;

    const createRule = {
      mch_id: { type: 'int', require: true },
      content: { type: 'string' },
    };

    const crypto = require('crypto');
    const md5 = crypto.createHash('MD5');
    let num = null;
    const random = require('string-random');
    let ast = null;
    let id = 2;
    let name = 'hhh';
    let value = '1';

    ctx.session.user = {hhh : 1111};
    ctx.body = {

    };
  }
  async test(){
    const { ctx, app } = this;
    const { Admin,User,WechatApp } = ctx.model;
    const { lock } = ctx.service;

    const { id = 1 , page = 1, page_size = 10 } = ctx.request.body;
    const user = await User.findOne();
    // assert(id,'参数id不能为空');
    app.user = user;

    ctx.body = {
      utl: ctx.path,
      reg: '/dd/api'.search(/^\/api/),
      json: JSON.stringify({id: 11}),
      // id: id
      // data: await lock.modify( 2, { name: '2号锁' } ),
      cache: app.user,
      time: new Date().getTime(),
      method: ctx.method
    };
  }
}

module.exports = HomeController;
