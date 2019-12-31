'use strict';

module.exports = () => {
  return async function(ctx, next) {

    await next();

    ctx.app.runInBackground(async ctx => {

      // 记录用户访问日志
      const user = ctx.app.userInfo;
      const { SysLog } = ctx.model;
      console.log(ctx.app.userInfo);
      await SysLog.create({
        com_id: user.com_id,
        user_id: user.id,
        path: ctx.path,
        params: JSON.stringify(ctx.request.body),
        response_text: JSON.stringify(ctx.body)
      });
    })
  };

};
