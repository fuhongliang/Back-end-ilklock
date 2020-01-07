'use strict';

const path=require('path');
const Controller = require('egg').Controller;
const wx = require('wx-minprogram');
const assert = require('assert');
const crypto = require('crypto');


class HomeController extends Controller {
  async index() {
    const { ctx ,app } = this;
    const { data } = ctx.request.body;
    const { Admin,User,WechatApp, Role } = ctx.model;
    let str = JSON.stringify([2,3,4]);
    let arr = JSON.parse(str);
    const access_token = crypto.createHash('MD5').update('user1').digest('hex');
    const key = crypto.createHash('MD5').update(access_token + '-user-1').digest('hex');
    const user = await User.findOne({ where: {id: 1}});
    // await app.cache.set('test',{hh: '哈哈', test: '测试'});
    arr.push('3');
    const role = await Role.findOrCreate({ where: { id: 16, com_id: 1 } , defaults:{ id: '',name: '普通用户', desc: '哈哈哈', addtime: new Date().getTime()} });
    console.log(role);

    ctx.body = {
      test: await this.test2('ddd'),
      a: ctx.helper.inArray(1,['1', 2]),
      arr: [...new Set(arr)],
      str: JSON.stringify("sss"),
      // userInfo: ctx.app.userInfo,
      json: JSON.parse(JSON.stringify("sss")),
      // cache: app.authCache,
      access_token,
      // computer: 4/3

    };
  }
  async test(){
    const { ctx, app } = this;
    let id = 1,name = '哈哈哈',region_id = '0';
    const validateResult = await ctx.validate('lock.modify',{ id, name });

    if (!validateResult){
      return ;
    }
    ctx.body = {
      host: ctx.request.protocol + '://' + ctx.request.host,
      // parse: JSON.parse([10,11,12])
      crypto: crypto.createHash('sha1').update('123456'),
    };

  }

  async test2(str = '哈哈哈') {
    return str;
  }
}

module.exports = HomeController;
