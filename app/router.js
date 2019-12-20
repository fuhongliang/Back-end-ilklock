'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index);
  router.get('/web/login', controller.website.passport.login);
  router.get('/test',controller.home.test);

  // api
  router.post('/api/login', controller.wxapi.passport.login);
  router.post('/api/index', controller.wxapi.index.index);
};
