'use strict';
const assert = require('assert');
module.exports = () => {
  return async function(ctx, next) {

    // 判断用户是否登录
    let url = ctx.path;
    const { User, Admin } = ctx.model;
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

    } else if (/^\/web\/admin/.test(url)) {

      const admin = ctx.session.adminInfo;
      let returnUrl = `/web/admin/login?return_url=${ctx.helper.getHost()}${url}`;
      if (ctx.querystring){
        returnUrl += '&' + ctx.querystring
      }

      if (!admin){
        ctx.redirect(returnUrl);
        return;
      }
      let adminInfo = await Admin.findOne({ where:{ id: admin.id, is_delete: 0 } });
      if (!adminInfo){
        ctx.redirect(returnUrl);
        return;
      }
      ctx.app.adminInfo = adminInfo;

    } else if (/^\/web/.test(url)) {

      const user = ctx.session.userInfo;
      let returnUrl = `/web/login?return_url=${ctx.helper.getHost()}${url}`;
      if (ctx.querystring){
        returnUrl += '&' + ctx.querystring
      }
      if (!user){
        ctx.redirect(returnUrl);
        return;
      }
      let userInfo = await User.findOne({ where:{ id: user.id, is_delete: 0 } });
      if (!userInfo){
        ctx.redirect(returnUrl);
        return;
      }
      ctx.app.userInfo = userInfo;
    }
    await next();
  };

};
