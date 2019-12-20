'use strict';

const Core = require('@alicloud/pop-core');

class Alysms {

  constructor(accessKeyId,accessKeySecret) {
    this.accessKeyId = accessKeyId;
    this.accessKeySecret = accessKeySecret;
    this.init();
  }

  init(){
    this.params = { "RegionId": "cn-hangzhou", "PhoneNumbers": "" };
    this.requestOption = { method: 'POST' };
    this.client = new Core({
      accessKeyId: this.accessKeyId,
      accessKeySecret: this.accessKeySecret,
      endpoint: 'https://dysmsapi.aliyuncs.com',
      apiVersion: '2017-05-25'
    });
  }

  addParams(key,value){
    this.params[key] = value;
    return this;
  }

  setSignName(sign_name){
    this.params.SignName = sign_name;
    return this;
  }

  setTemplateCode(code){
    this.params.TemplateCode = code;
    return this;
  }

  setTemplateParam(params){
    this.params.TemplateParam = JSON.stringify(params);
    return this;
  }

  addPhone(phone){
    this.params.PhoneNumbers += phone;
  }

  sendSms(){
    this.client.request('SendSms', this.params, this.requestOption).then((result) => {
      return result;
    }, (ex) => {
      throw ex;
    })
  }
};

module.exports = Alysms;

