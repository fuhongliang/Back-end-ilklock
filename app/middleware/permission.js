'use strict';
const permissions = {
  safe: [
    '/web/login',
    '/web/get_captcha',
    '/web/home',
    '/web/list_region',
    '/web/upload_file',
    '/web/get_users'
  ],
  qygl: [
    '/web/locks',
    '/web/get_locks',
    '/web/edit_lock',
    '/web/auth_lock',
    '/web/del_lock'
  ],
  qysz: [
    '/web/region',
    '/web/edit_region',
    '/web/del_region',
    '/web/add_region',
  ],
  rygl: [
    '/web/users',
    '/web/del_user',
    '/web/edit_user',
  ],
  kssq: [
    '/web/list_apply',
    '/web/review_apply'
  ],
  jsgl: [
    '/web/roles',
    '/web/del_role',
    '/web/edit_role'
  ],
  ckjl: [
    '/web/operate_list'
  ],
};
module.exports = () => {
  return async function(ctx, next) {
    const user = ctx.app.userInfo;
    if (user.level !== 0){
      const path = ctx.path;
      let perms = '';
      for (let key in permissions){
        if (permissions[key].includes(path)){
          perms = key;
        }
      }

      if (perms && perms !== 'safe'){
        if (!await ctx.helper.isPermission(user.id || 0,perms))
          return;
      }
    }

    await next();
  }
};
