'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class PassportController extends BaseController {
  async login() {
    const { ctx } = this;
    if (ctx.request.method === 'POST'){

      const validateResult = await ctx.validate('passport.webLogin',ctx.request.body);

      if (!validateResult){
        return ;
      }
      const { passport } = ctx.service;
      ctx.body = await passport.userLogin();
    }else{
      let url = ctx.query?ctx.query.return_url:'';
      await ctx.render('passport/login',{ returnUrl: url});
    }
  }

  async captcha() {

    const { app, ctx } = this;
    const svgCaptcha = require('svg-captcha');
    const options = {// 参数
      size: 5,
      width: 120,
      height: 40, // height of captcha
      fontSize: 20, // captcha text size
      color: false,
      noise: 0
    };
    svgCaptcha.loadFont(path.join(process.cwd(),'app/util/fonts/PingFang Regular.ttf'));
    const Captcha = svgCaptcha.create(options); //生成验证码
    ctx.set('content-type', 'image/svg+xml;charset=UTF-8');
    ctx.session.code = Captcha.text.toLocaleLowerCase();
    ctx.body = Captcha.data;
  }

  async logout() {
    const user = this.app.userInfo;
    const { AuthLogin } = this.app.model;
  }
}

module.exports = PassportController;
