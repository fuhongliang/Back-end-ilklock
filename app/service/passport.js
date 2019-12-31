'use strict';
const path = require('path');
const wx = require('wx-minprogram');
const BaseService = require(path.join(process.cwd(), 'app/service/baseService'));

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
          await app.cache.set(access_token + '-account',account.toJSON(),60*60);
          return {
            code: 1,
            msg: '请绑定手机号',
            data: {
              access_token
            }
          };
        } else {
          let user = await User.findOne({where: {id: account.user_id}});
          await app.cache.set(access_token + '-user-' + user.id,user.toJSON(),60*60*24*7);
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

}
module.exports = PassportService;
