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
    const md5 = crypto.createHash('MD5');
    const access_token = md5.update('user_info=&test').digest('hex');
    let user = await User.findOne({where: {id: 1}});
    await app.cache.set(access_token + '-user-' + user.id,user.toJSON(),60*60*24*7);
    await app.cache.set('test',{ test: '哈哈哈哈', msg: '缓存测试'},6000);
    ctx.body = {
      test: /^1[3456789]\d{9}$/.test(undefined),
      access_token: access_token,
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
