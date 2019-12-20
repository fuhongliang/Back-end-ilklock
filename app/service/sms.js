'use strict';
const path = require('path');
const BaseService = require('./baseService');
const Sms = require(path.join(process.cwd(),'app/util/alysms'));
class SmsService extends BaseService{

  async sendSmsCode(){
    const random = require('string-random');
    const { AlySms } = this.ctx.model;
    const { phone } = this.ctx.body;
    let setting = await AlySms.findOne();
    if (!setting){
      setting = this.config.alysms;
    }
    let code = random(6, {letters: false});
    this.ctx.phoneCode = { phone , code };
    let sms = new Sms(setting.access_key_id,setting.access_secret);
    try{
      sms.setSignName(setting.sign_name)
        .setTemplateCode(setting.sms_code)
        .setTemplateParam({ code })
        .addPhone(phone).sendSmsCode();
    } catch (err) {
      this.logger('短信发送异常' + err);
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
