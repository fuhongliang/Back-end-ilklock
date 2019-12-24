'use strict';
const path = require('path');
const BaseService = require('./baseService');
const Sms = require(path.join(process.cwd(),'app/util/alysms'));
class SmsService extends BaseService{

  async sendSmsCode(){
    const { app, logger, ctx } = this;
    const random = require('string-random');
    const { AlySms } = ctx.model;
    const { phone, access_token } = ctx.request.body;

    const rule = {
      phone: { require: true, format: /^1[3456789]\d{9}$/},
      access_token: { require: true }
    };
    let errs = app.validator.validate(rule, ctx.request.body);

    if (errs){
      return {
        code: 1,
        msg: errs
      }
    }

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
        .addPhone(phone).sendSmsCode();
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
