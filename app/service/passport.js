'use strict';
const path = require('path');
const wx = require('wx-minprogram');
const BaseService = require(path.join(process.cwd(), 'app/service/baseService'));
const crypto = require('crypto');

class PassportService extends BaseService{

  async login(){
    const { ctx, app } = this;
    const { WxAccount,User } = ctx.model;
    const { code, encryptedData, iv, rawData, signature } = ctx.request.body;
    const md5 = crypto.createHash('MD5');

    const result = await wx.auth.code2Session({ js_code: code });

    if (result.openid && wx.units.checkUserSign({ session_key: result.session_key, rawData, signature })) {
      let decrypt_data = '';
      try{
        decrypt_data = wx.units.decryptData({encryptedData, sessionKey: result.session_key, iv});
      }catch (err) {
        ctx.logger.warn('解析用户数据失败' + err);
        return {
          code: 1000,
          msg: '解析用户数据失败'
        }
      }

      if (decrypt_data){

        // 获取到微信用户openid unionid,查询数据库
        let account = await WxAccount.findOne({
          where: {
            openid: result.openid,
            unionid: result.unionid,
          }
        });

        if (!account) {
          account = await WxAccount.create({nickname: decrypt_data.nickName,avatar: decrypt_data.avatarUrl,openid: decrypt_data.openId,unionid: decrypt_data.unionId});
        }

        const access_token = md5.update('user_info=' + result.session_key + '&' + result.openid).digest('hex');

        if (!account.user_id) {
          this.setUser(access_token,account.toJSON(),60*10, 'wxAccount');
          // await app.cache.set(access_token + '-account',account.toJSON(),60*60);
          return {
            code: 1,
            msg: '请绑定手机号',
            data: {
              access_token
            }
          };
        } else {
          let user = await User.findOne({where: {id: account.user_id}});
          this.setUser(access_token,account.toJSON(),60*60*24*7,'wechatUser',user.id);
          return {
            code: 0,
            msg: '登录成功',
            data: {
              nickname: decrypt_data.nickName,
              avatar: decrypt_data.avatarUrl,
              access_token: access_token,
              user: user
            }
          };
        }
      }
    }
  }

  async binding(){
    const { ctx, app } = this;
    const { phone, code, access_token } = ctx.request.body;
    const { WxAccount,User } = ctx.model;
    let phones = await this.getUser(access_token,'sms');

    if (!phones){
      return {
        code: 1,
        msg: '验证码不存在'
      }
    }

    if (phones.phone != phone || phones.code != code){
      return {
        code: 1,
        msg: '验证码错误'
      };
    }

    let user = await User.findOne({where: {phone: phone}});

    if (!user){
      return {
        code: 1,
        msg: '手机号不存在',
      };
    }

    let account = this.getUser(access_token,'wxAccount');
    if (!account){
      return {
        code: -1,
        msg: '请重新登录'
      };
    }

    let result = await WxAccount.update({user_id: user.id},{where: {openid: account.openid,unionid: account.unionid}});
    if (result){
      this.setUser(access_token,user.toJSON(),60*60*24*7,'wechatUser',user.id);

      return {
        code: 0,
        msg: '绑定成功',
        data: {
          avatar: account.avatar,
          nickname: account.nickname,
          user: user.toJSON(),
        }
      };
    }
  }

}
module.exports = PassportService;
