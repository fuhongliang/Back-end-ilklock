/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
const path = require('path');

module.exports = appInfo => {

  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1576458671859_8708';

  // add your middleware config here
  config.middleware = [ 'errorHandler', 'access', 'auth', 'permission', 'sysLog'];

  // 中间件配置
  config.errorHandler = {
    enable: true,
    match: '/api/v1',
  };


  config.auth = {
    enable: true,
    ignore: ['/api/v1/login', '/api/v1/binding', '/api/v1/get_valid_code', '/web/login', '/web/get_captcha', '/static', '/web/admin/login'],
  };

  config.permission = {
    enable: true,
    ignore: ['/web/admin'],
  };

  config.access = {
    enable: true,
    match: '/api/v1',
  };

  config.sysLog = {
    enable: true,
    match: '/api/v1',
  };

  // 验证器
  config.validatePlus = {
    resolveError(ctx, errors) {
      if (errors.length) {
        ctx.type = 'json';
        ctx.status = 200;
        ctx.body = {
          code: 1,
          err_field: errors[0].field,
          msg: '参数错误' + errors[0].message,
        };
      }
    }
  };

  // session
  config.session = {
    key: 'egg:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: true, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
  };

  // 数据库
  config.sequelize = {
    // 单数据库信息配置
    dialect: 'mysql',
    host: 'ilklock-public-mysql-dk38ql.mysql.polardb.rds.aliyuncs.com',
    port: 3306,
    database: 'ilklock_test',
    username:"ilklock_test",
    password:"BVx4CbM7MR9CC9",
    define: {
      freezeTableName: false,
      createdAt: false,
      updatedAt: false
    },
    // operatorsAliases: {}
  };

  // 配置模板引擎
  config.view = {
    defaultViewEngine: 'nunjucks',
    defaultExtension: '.html',
    mapping: {
      '.html': 'nunjucks',
    },
  };
  config.nunjucks = {
    tags: {
      blockStart: '<%',
      blockEnd: '%>',
      variableStart: '<$',
      variableEnd: '$>',
      commentStart: '<#',
      commentEnd: '#>'
    },
    noCache: true,
  };

  // 配置阿里云短信
  config.alysms = {
    access_key_id: 'LTAI4FcKwPHHa5a67bjFCqhK',
    access_secret: 'a9Jwyr39mJYo7JuvsFJ7ZAV0bQ83H1',
    sign_name: '艾乐科智能闭锁',
    sms_code: 'SMS_181500433',
  };

  config.security = {
    csrf: {
      enable: true,
      match: '/web',
      xframe: {
        //...
      },
    },
  };

  // 静态资源
  // 靜態目錄及緩存設置
  config.static = {
    prefix: '/static/', //靜態化URL  我這裏默認網站根目錄（項目需要）
    dir: path.join(appInfo.baseDir, 'app/public'), // 靜態文件夾地址 可以設置多個 可以簡寫為 ：['app/public','app/public1']
    dynamic: true, //是否緩存靜態資源
    preload: false, //啓動項目開啓緩存
    // maxAge: 31536000,
    maxAge: 0, //緩存時間 開發建議設0 跳坑
    buffer: false, // 是否緩存到内存 默認prod 緩存
  };

  // 配置上传
  config.multipart = {
    fileSize: '50kb',
    mode: 'stream',
    fileExtensions: ['.xlsx'], // 扩展几种上传的文件格式
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
