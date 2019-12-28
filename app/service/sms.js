'use strict';
const path = require('path');
const assert = require('assert');
const BaseService = require(path.join(process.cwd(), 'app/service/baseService'));
const Sms = require(path.join(process.cwd(),'app/util/alysms'));
class SmsService extends BaseService{

  async sendSmsCode(phone){
    const { app, logger, ctx } = this;
    const random = require('string-random');
    const { AlySms } = ctx.model;
    const { access_token } = ctx.request.body;
    assert(access_token,'access_token不能为空');
    let setting = await AlySms.findOne();
    if (!setting){
      setting = this.config.alysms;
    }
    let code = random(6, {letters: false});

    await app.cache.set(access_token + '-' + phone, { phone , code },60*10);
    let sms = new Sms(setting.access_key_id,setting.access_secret);
    try{
      sms.setSignName(setting.sign_name)
        .setTemplateCode(setting.sms_code)
        .setTemplateParam({ code })
        .addPhone(phone).sendSms();
    } catch (err) {
      logger.warn('短信发送异常' + err);
      return {
        code: 1,
        msg: '短信发送失败'
      }
    }
    return {
      code: 0,
      msg: '发送成功'
    }
  }
}
module.exports = SmsService;
