'use strict';

const Service = require('egg').Service;

class BaseService extends Service{

  async setUser(key,value,ttl = 60*60*24*5, type = 'wechatUser', user_id = 0){
    const { AuthLogin } = this.ctx.model;
    let res = '';
    if (user_id){
      res = await AuthLogin.update({ key, data: JSON.stringify(value), expire_time: (new Date().getTime() + ttl*1000) }, { where: { user_id, type } });
    }else{
      res = await AuthLogin.update({ data: JSON.stringify(value), expire_time: (new Date().getTime() + ttl*1000) }, { where: { key, user_id, type } });
    }

    if (!res || res[0] < 1){
      await AuthLogin.create({ key: key, user_id, type, data: JSON.stringify(value), expire_time: (new Date().getTime() + ttl*1000) });
    }

  }

  async getUser(key,type,user_id = 0){

    const { AuthLogin } = this.ctx.model;
    const user = await AuthLogin.findOne({ where: {key: key, user_id, type }});

    if (!user || user.expire_time < new Date().getTime()){
      return '';
    }
    if (user.expire_time < new Date().getTime() + 60*60*24*2 && user_id){
      await AuthLogin.update({ expire_time: new Date().getTime() + 60*60*24*5 },{ where: {key: key, user_id, type } });
    }
    return JSON.parse(user.data);
  }

}

module.exports = BaseService;
