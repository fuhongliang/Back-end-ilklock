'use strict'

const access_app_key = ['wechat','web'];
const access_app_secret = {
  web: '*92323sfss*723232sosspwe',
  wechat: '(2323SDF@329325*92023ssd',
};

function in_array(value,arr){
  for (let val of arr){
    if (val === value){
      return true;
    }
  }
  return false;
}
  // 'web' => '*92323sfss*723232sosspwe',
  // 'iOS' => '@#9sdsdjoo20203Sxsdod))*&2',
  // 'android' => '@@0wewelsd9s892323239((',
  // 'wechat' => '(2323SDF@329325*92023ssd',

const crypto = require('crypto');
const assert = require('assert');

module.exports = (app,options) => {
  return async function(ctx, next) {

    if (!ctx.request.body.is_debug && ctx.request.method === 'post'){
      const { app_key, access_sign, nonce_str, access_time } = ctx.request.body;
      // 判检查用户访问参数
      assert(app_key,'需要app_key参数');
      assert(access_sign,'需要access_sign参数');
      assert(nonce_str,'需要nonce_str参数');
      assert(access_time,'需要access_time参数');

      if (!in_array(app_key,access_app_key)){
        throw 'app_key不存在';
      }

      const md5 = crypto.createHash('MD5');
      let check_sign = md5.update(md5.update(nonce_str + access_app_secret[app_key]).digest('hex') + access_time).digest('hex');
      assert.strictEqual(access_sign,check_sign,'签名错误');
    }
    await next();
  };

};
