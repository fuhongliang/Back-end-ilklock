'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class PassportController extends BaseController {
  async login() {
    const { ctx } = this;
    if (ctx.request.method === 'POST'){
        const { username, password, code } = ctx.request.body;
    }else{
      await ctx.render('passport/login');
    }
  }

  async captcha() {

    const { app, ctx } = this;
    const svgCaptcha = require('svg-captcha');
    const options = {// 参数
      size: 5,
      width: 120,
      height: 48, // height of captcha
      fontSize: 20, // captcha text size
      color: false,
      noise: 0
    };
    svgCaptcha.loadFont(path.join(process.cwd(),'app/util/fonts/PingFang Regular.ttf'));
    const Captcha = svgCaptcha.create(options); //生成验证码
    ctx.set('content-type', 'image/svg+xml;charset=UTF-8');
    ctx.session.code = Captcha.text;
    ctx.body = Captcha.data;
  }
}

module.exports = PassportController;
