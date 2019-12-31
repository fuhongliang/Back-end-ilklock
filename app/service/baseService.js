'use strict';

const Service = require('egg').Service;

class BaseService extends Service{

  async setUser(key,value,ttl = 60*60*24*5){
    const { AuthLogin } = this;
    await AuthLogin.create({id: key, data: JSON.stringify(value), expire_time: new Date().getTime() + ttl*1000});
  }

  async getUser(key){
    const { AuthLogin } = this;
    const { user } = AuthLogin.findOne({ where: {id: key}});
    if (!user){
      return '';
    }
    if (user.expire_time < new Date().getTime() + 60*60*24*2){
      AuthLogin.update({ expire_time: new Date().getTime() + 60*60*24*5 },{where:{id: key}});
    }
    return user;
  }
}

module.exports = BaseService;
