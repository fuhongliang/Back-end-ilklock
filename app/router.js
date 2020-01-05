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


  // web
  router.all('/web/login', controller.website.passport.login);
  router.get('/web/get_captcha', controller.website.passport.captcha);
  router.get('/web/home', controller.website.home.index);
  // 锁
  router.get('/web/locks', controller.website.region.locks);
  router.get('/web/get_locks', controller.website.region.getLocks);
  router.post('/web/edit_lock', controller.website.region.editLock);

  // 用户
  router.get('/web/get_users', controller.website.user.listUser);

  router.get('/web/users', controller.website.user.index);
  router.get('/web/region/setting', controller.website.region.setting);
  router.get('/web/apply/list', controller.website.apply.list);
  router.get('/web/role/list', controller.website.role.list);
  router.get('/web/operate-list', controller.website.record.operateList);

  //
  router.get('/', controller.home.index);
  router.get('/test', controller.home.test);

};
