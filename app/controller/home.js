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
      hhh: 123,
      data: wx.config.getConfig(),
      path: path.join(process.cwd(),'wx.config.js'),
      user: await Admin.findOne(),
      model: app.model.Admin,
      add: num,
      root_path: this.config.baseDir,
      code: random(16),
      ast: ast,
      md5: md5.update('111').digest('hex')
    };
  }
  async test(){
    const { ctx, app } = this;
    const { Admin,User,WechatApp } = ctx.model;

    const { id , page = 1, page_size = 10 } = ctx.request.body;
    // assert(id,'参数id不能为空');
    // const data = await ctx.service.record.getOperateRecordById(id,{ page: parseInt(page), page_size: parseInt(page_size)});
    let data = Array();
    data[0] = '哈哈哈哈';
    ctx.body = {
      utl: ctx.path,
      reg: '/dd/api'.search(/^\/api/),
      json: JSON.stringify({id: 11}),
      // id: id
      data: data[0] ? data[0] : 1
    };
  }
}

module.exports = HomeController;
