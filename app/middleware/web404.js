'use strict';

module.exports = () => {
  return async function(ctx, next) {
    await next();
    if (ctx.status === 404) {
      if (ctx.session.adminInfo){
        ctx.redirect('/web/admin/list_comp');
      }else{
        ctx.redirect('/web/locks');
      }

    }
  }
};
