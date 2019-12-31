'use strict';

const Service = require('egg').Service;

class BaseService extends Service{

  async setUser(key,value,ttl = 60*60*24*5, type = 'wechatUser', user_id = 0){
    const { AuthLogin } = this.ctx.model;
    await AuthLogin.create({ key: key, user_id, type, data: JSON.stringify(value), expire_time: (new Date().getTime() + ttl*1000) });
  }

  async getUser(key,type,user_id = 0){

    const { AuthLogin } = this.ctx.model;
    const user = await AuthLogin.findOne({ where: {key: key, user_id, type }});

    if (!user){
      return '';
    }
    if (user.expire_time < new Date().getTime() + 60*60*24*2 && type === 'wechatUser'){
      await AuthLogin.update({ expire_time: new Date().getTime() + 60*60*24*5 },{ where: {key: key, user_id, type } });
    }
    return JSON.parse(user.data);
  }
}

module.exports = BaseService;
