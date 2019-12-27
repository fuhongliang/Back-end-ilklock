'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {

  const { router, controller } = app;

  // web
  router.prefix('/web/v1');

  router.get('/login', controller.website.passport.login);
  router.get('/home', controller.website.home.index);
  router.get('/locks', controller.website.agent.locks);
  router.get('/users', controller.website.user.index);
  router.get('/setting', controller.website.agent.setting);
  router.get('/apply/list', controller.website.apply.list);
  router.get('/role/list', controller.website.role.list);
  router.get('/operate-list', controller.website.record.operateList);


  router.get('/', controller.home.index);
};
