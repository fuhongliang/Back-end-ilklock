'use strict';
const assert = require('assert');
module.exports = () => {
  return async function(ctx, next) {

    // 判断用户是否登录
    let url = ctx.request.url;

    if (/^\/api\/v1/.test(url) && ctx.method === 'POST'){
      const { access_token, user_id } = ctx.request.body;
      assert(access_token,'参数access_token不能为空');
      assert(user_id,'参数user_id不能为空');
      let user = await ctx.app.cache.get(access_token + '-user-' + user_id);
      if (!user){
        ctx.body = {
          code: -1,
          msg: '账号未登录',
        };
        return;
      }

    } else {
      let is_login = false;
      if (is_login) {
        return;
      }
    }
    await next();
  };

};
