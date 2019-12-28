'use strict';

const path = require('path');

const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class IndexController extends BaseController{

  async getSmsCode(){
    const { ctx } = this;
    const { sms } = ctx.service;

    const { phone } = ctx.request.body;
    console.log(ctx.request.body);
    if (/^1[3456789]\d{9}$/.test(phone)){
      ctx.body = {
        code: 1,
        msg: '手机号格式错误'
      }
    }
    ctx.body = await sms.sendSmsCode(phone);
  }
}
module.exports = IndexController;
