'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;


  router.get('/web/login', controller.website.passport.login);
  router.get('/web/home', controller.website.home.index);
  router.get('/region/locks', controller.website.agent.locks);
  router.get('/users', controller.website.user.index);
  router.get('/region/setting', controller.website.agent.setting);
  router.get('/apply/list', controller.website.apply.list);
  router.get('/role/list', controller.website.role.list);
  router.get('/operate-list', controller.website.record.operateList);

  router.get('/', controller.home.index);
  router.get('/api/v1/test',controller.home.test);

  // api
  router.post('/api/login', controller.wxapi.passport.login);
  router.post('/api/binding', controller.wxapi.apply.getKeys);
  router.post('/api/index', controller.wxapi.index.index);
  router.post('/api/get_keys', controller.wxapi.apply.getKeys);
  router.post('/api/get_lock', controller.wxapi.lock.getLockInfo);
  router.post('/api/get_area_locks', controller.wxapi.lock.getAreaLock);
  router.post('/api/add_lock', controller.wxapi.lock.createLock);
  router.post('/api/modify_lock_name', controller.wxapi.lock.createLock);
};
