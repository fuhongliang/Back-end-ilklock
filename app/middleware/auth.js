'use strict';

module.exports = (app,options) => {
  return async function(ctx, next) {

    // 判断用户是否登录
    let url = ctx.request.url;
    if (url.search(/^\/api/) < 0){
      let is_login = false;
      if (is_login) {
        return;
      }

    } else {
      const { access_token } = ctx.request.body;
      let user = await app.cache.get(access_token + '-user');
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
