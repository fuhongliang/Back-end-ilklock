'use strict';

const path = require('path');

const Controller = require(path.join(process.cwd(),'app/controller/baseController'));

class IndexController extends Controller{

  async getSmsCode(){
    const { sms } = this.ctx.service;
    return sms.sendSmsCode();
  }
}
