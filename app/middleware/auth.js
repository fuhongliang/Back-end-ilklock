'use strict';
const assert = require('assert');
module.exports = (app,options) => {
  return async function(ctx, next) {

    // 判断用户是否登录
    let url = ctx.request.url;
    if (url.search(/^\/api/) < 0 || true){
      let is_login = false;
      if (is_login) {
        return;
      }

    } else {
      const { access_token, user_id } = ctx.request.body;
      assert(access_token,'参数access_token不能为空');
      assert(user_id,'参数user_id不能为空');
      let user = await app.cache.get(access_token + '-user-' + user_id);
      if (!user){
        ctx.body = {
          code: -1,
          msg: '账号未登录',
        };
        return;
      }
    }
    await next();
  };

};
