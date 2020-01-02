'use strict';
const assert = require('assert');
module.exports = () => {
  return async function(ctx, next) {

    // 判断用户是否登录
    let url = ctx.path;
    const { User } = ctx.model;
    if (/^\/api\/v1/.test(url) && ctx.method === 'POST'){
      const { access_token, user_id } = ctx.request.body;
      assert(access_token,'参数access_token不能为空');
      assert(user_id,'参数user_id不能为空');

      let user = await ctx.service.passport.getUser(access_token,'wechatUser',user_id);

      let userInfo = await User.findOne({ where:{ id: user_id, is_delete: 0 } });
      if (!user || !userInfo){
        ctx.body = {
          code: -1,
          msg: '账号未登录',
        };
        return;
      }
      ctx.app.userInfo = userInfo;

    } else if (/^\/web/.test(url)) {

      const user = ctx.session.userInfo;
      let userInfo = await User.findOne({ where:{ id: user.id, is_delete: 0 } });
      if (!user || !userInfo){
        ctx.redirect('/web/login?return_url=' + ctx.helper.getHost() + url + '&' + ctx.querystring);
      }
    }
    await next();
  };

};
