'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index);
  router.get('/web/login', controller.website.passport.login);
  router.get('/web/home', controller.website.home.index);
  router.get('/agent/locks', controller.website.agent.locks);
  router.get('/users', controller.website.user.index);
  router.get('/agent/setting', controller.website.agent.setting);
  router.get('/apply/list', controller.website.apply.list);
  router.get('/role/list', controller.website.role.list);
  router.get('/operate-list', controller.website.record.operateList);
  router.get('/test',controller.home.test);

  // api
  router.post('/api/login', controller.wxapi.passport.login);
  router.post('/api/index', controller.wxapi.index.index);
};
