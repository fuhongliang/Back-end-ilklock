'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {


  const { router, controller } = app;

  // api
  router.prefix('/api/v1');
  router.post('/login', controller.wxapi.passport.login);
  router.post('/get_valid_code', controller.index.getSmsCode);
  router.post('/binding', controller.wxapi.passport.binding);
  router.post('/index', controller.wxapi.index.index);
  router.post('/get_keys', controller.wxapi.apply.getKeys);
  router.post('/get_lock', controller.wxapi.lock.getLockInfo);
  router.post('/get_area_locks', controller.wxapi.lock.getAreaLock);
  router.post('/add_lock', controller.wxapi.lock.createLock);
  router.post('/modify_lock_name', controller.wxapi.lock.createLock);
  router.post('/locks_log', controller.wxapi.record.operateList);


  router.get('/', controller.home.index);
  router.get('/test', controller.home.test);

};
