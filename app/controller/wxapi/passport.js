'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));
const wx = require('wx-minprogram');
const assert = require('assert');
const crypto = require('crypto');

class passportController extends BaseController {

  async login() {
    const { ctx, app } = this;
    const { WxAccount,User } = ctx.model;
    const { code, encryptedData, iv, rawData, signature } = ctx.request.body;
    const md5 = crypto.createHash('MD5');
    const validateResult = await ctx.validate('login',ctx.request.body);

    if (!validateResult){
      return ;
    }

    const result = await wx.auth.code2Session({ js_code: code });

    let data = {
      code: 1000,
      msg: '用户登录失败',
    };

    if (result.openid && wx.units.checkUserSign({ session_key: result.session_key, rawData, signature })) {
      let decrypt_data = '';
      try{
        decrypt_data = wx.units.decryptData({encryptedData, sessionKey: result.session_key, iv});
      }catch (err) {
        decrypt_data = '';
        ctx.logger.warn('解析用户数据失败' + err);
      }

      if (decrypt_data){

      // 获取到微信用户openid unionid,查询数据库
        let account = await WxAccount.findOne({
          where: {
            openid: result.openid,
            unionid: result.unionid,
          }
        });
        // ctx.body = decrypt_data.;
        // return;
        if (!account) {
          account = await WxAccount.create({nickname: decrypt_data.nickName,avatar: decrypt_data.avatarUrl,openid: decrypt_data.openId,unionid: decrypt_data.unionId});
        }

        const access_token = md5.update('user_info=' + result.session_key + '&' + result.openid).digest('hex');

        app.cache.set(access_token + '-account',account.toJSON(),60*60);

        if (!account.user_id) {
          data.code = 1;
          data.msg = '请绑定手机号';
          data.data = {
            access_token: access_token
          }
        } else {
          let user = User.findOne({where: {id: account.user_id}});
          app.cache.set(access_token + '-user-' + user.id,user.toJSON(),60*60*24*7);
          data.code = 0;
          data.msg = '登录成功';
          data.data = {
            nickname: decrypt_data.nickName,
            avatar: decrypt_data.avatarUrl,
            access_token: access_token,
            user: user
          }
        }
      }
    }

    ctx.body = data;

  }

  async binding(){
    const { ctx, app } = this;
    const { phone, code, access_token } = ctx.request.body;
    const { WxAccount,User } = ctx.model;

    let phones = await app.cache.get(access_token + '-' + phone);

    if (phones.phone !== phone || phones.code !== code){
      return {
        code: 1,
        msg: '验证码错误'
      }
    }

    let user = User.findOne({where: {phone: phone}});

    if (!user){
      return {
        code: 1,
        msg: '手机号不存在',
      }
    }

    let account = await app.cache.get(access_token + '-account');
    let result = await WxAccount.update({user_id: user.id},{where: {openid: account.openid,unionid: account.unionid}});
    if (result){
      app.cache.set(access_token + '-user-' + user.id,user.toJSON(),60*60*24*7);

      return {
        code: 0,
        msg: '绑定成功',
        data: {
          avatar: account.avatar,
          nickname: account.nickname,
          user: user.toJSON(),
        }
      }
    }
    return {
      code: 1000,
      msg: '绑定失败',
    }
  }

  async apply(){
    const { user } = this.ctx.service;
    return user.register();
  }
}

module.exports = passportController;
