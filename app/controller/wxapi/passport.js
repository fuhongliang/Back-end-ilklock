'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));
const wx = require('wx-minprogram');
const assert = require('assert');
const crypto = require('crypto');

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

    let phones = await app.cache.get(access_token + '-' + phone);

    if (phones.phone != phone || phones.code != code){
      ctx.body = {
        code: 1,
        msg: '验证码错误'
      };
      return ;
    }

    let user = await User.findOne({where: {phone: phone}});

    if (!user){
      ctx.body = {
        code: 1,
        msg: '手机号不存在',
      };
      return ;
    }

    let account = await app.cache.get(access_token + '-account');
    if (!account){
      ctx.body = {
        code: -1,
        msg: '请重新登录'
      };
      return ;
    }

    let result = await WxAccount.update({user_id: user.id},{where: {openid: account.openid,unionid: account.unionid}});
    if (result){
      app.cache.set(access_token + '-user-' + user.id,user.toJSON(),60*60*24*7);

      ctx.body = {
        code: 0,
        msg: '绑定成功',
        data: {
          avatar: account.avatar,
          nickname: account.nickname,
          user: user.toJSON(),
        }
      };
      return ;
    }
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
