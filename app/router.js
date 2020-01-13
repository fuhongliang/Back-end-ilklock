'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {


  const { router, controller } = app;

  // api
  router.post('/api/v1/login', controller.wxapi.passport.login);
  router.post('/api/v1/get_valid_code', controller.index.getSmsCode);
  router.post('/api/v1/binding', controller.wxapi.passport.binding);
  router.post('/api/v1/index', controller.wxapi.index.index);
  router.post('/api/v1/get_keys', controller.wxapi.apply.getKeys);
  router.post('/api/v1/get_lock', controller.wxapi.lock.getLockInfo);
  router.post('/api/v1/get_area_locks', controller.wxapi.lock.getAreaLock);
  router.post('/api/v1/add_lock', controller.wxapi.lock.createLock);
  router.post('/api/v1/modify_lock_name', controller.wxapi.lock.modifyName);
  router.post('/api/v1/locks_log', controller.wxapi.record.operateList);
  router.post('/api/v1/get_audits', controller.wxapi.apply.getAuditer);
  router.post('/api/v1/apply_open_locks', controller.wxapi.apply.applyKeySecret);
  router.post('/api/v1/get_area', controller.wxapi.region.getArea);
  router.post('/api/v1/list_apply', controller.wxapi.apply.getRecords);
  router.post('/api/v1/apply_open_lock', controller.wxapi.apply.applyKeySecret);
  router.post('/api/v1/renew_status', controller.wxapi.apply.renewStatus);


  // web
  router.all('/web/login', controller.website.passport.login);
  router.get('/web/get_captcha', controller.website.passport.captcha);
  router.get('/web/home', controller.website.home.index);
  router.get('/web/list_region', controller.website.region.list);
  router.post('/web/upload_file', controller.website.upload.uploadFile);
  router.get('/web/get_users', controller.website.user.listUser);

  // 锁 区域管理权限
  router.get('/web/locks', controller.website.region.locks);
  router.get('/web/get_locks', controller.website.region.getLocks);
  router.post('/web/edit_lock', controller.website.region.editLock);
  router.post('/web/auth_lock', controller.website.region.authLock);
  router.post('/web/del_lock', controller.website.region.delLock);


  // 区域设置 权限
  router.get('/web/region', controller.website.region.setting);
  router.post('/web/edit_region', controller.website.region.edit);
  router.post('/web/del_region', controller.website.region.del);
  router.all('/web/add_region', controller.website.region.add);



  // 用户管理权限
  router.get('/web/users', controller.website.user.index);
  router.post('/web/del_user', controller.website.user.del);
  router.post('/web/edit_user', controller.website.user.edit);
  router.post('/web/auth_patch', controller.website.user.authPatch);

  // 开锁申请记录
  router.get('/web/list_apply', controller.website.apply.list);
  router.post('/web/review_apply', controller.website.apply.review);

  // 超级管理员权限
  router.get('/web/roles', controller.website.role.list);
  router.post('/web/del_role',controller.website.role.del);
  router.post('/web/edit_role',controller.website.role.edit);

  // 开锁操作记录
  router.get('/web/operate_list', controller.website.record.operateList);

  // 开锁模式
  router.get('/web/mode_locks', controller.website.lock.listMode);
  router.post('/web/mode_auth', controller.website.lock.authMode);
  router.all('/web/mode_edit', controller.website.lock.modeEdit);
  router.get('/web/mode_del', controller.website.lock.modeDel);

  //
  router.get('/', controller.home.index);
  router.get('/test', controller.home.test);

};
