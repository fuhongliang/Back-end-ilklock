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
  config.middleware = [ 'access', 'auth' ];

  // 中间件配置
  config.auth = {
    enable: true,
    ignore: ['/web/login', '/api/login', '/api/binding'],
  };
  config.access = {
    enable: true,
    match: '/api',
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

  // 鉴权
  config.passportLocal = {
    usernameField: 'username',
    passwordField: 'password',
  };

  // 配置数据库
  const Op = require('sequelize').Op;
  config.sequelize = {
    // 单数据库信息配置
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'ilock',
    username:"root",
    password:"root",
    define: {
      freezeTableName: false,
      createdAt: false,
      updatedAt: false
    },
    operatorsAliases: {
      $eq: Op.eq,
      $ne: Op.ne,
      $gte: Op.gte,
      $gt: Op.gt,
      $lte: Op.lte,
      $lt: Op.lt,
      $not: Op.not,
      $in: Op.in,
      $notIn: Op.notIn,
      $is: Op.is,
      $like: Op.like,
      $notLike: Op.notLike,
      $iLike: Op.iLike,
      $notILike: Op.notILike,
      $regexp: Op.regexp,
      $notRegexp: Op.notRegexp,
      $iRegexp: Op.iRegexp,
      $notIRegexp: Op.notIRegexp,
      $between: Op.between,
      $notBetween: Op.notBetween,
      $overlap: Op.overlap,
      $contains: Op.contains,
      $contained: Op.contained,
      $adjacent: Op.adjacent,
      $strictLeft: Op.strictLeft,
      $strictRight: Op.strictRight,
      $noExtendRight: Op.noExtendRight,
      $noExtendLeft: Op.noExtendLeft,
      $and: Op.and,
      $or: Op.or,
      $any: Op.any,
      $all: Op.all,
      $values: Op.values,
      $col: Op.col
    }
  };

  // 配置阿里云短信
  config.alysms = {
    access_key_id: '',
    access_secret: '',
    sign_name: '',
    sms_code: '',
  };

  config.security = {
    csrf: {
      ignore: '/api',
      xframe: {
        //...
      },
    },
  };

  // 静态资源
  // 靜態目錄及緩存設置
  config.static = {
    prefix: '/', //靜態化URL  我這裏默認網站根目錄（項目需要）
    dir: path.join(appInfo.baseDir, 'app/public'), // 靜態文件夾地址 可以設置多個 可以簡寫為 ：['app/public','app/public1']
    dynamic: true, //是否緩存靜態資源
    preload: false, //啓動項目開啓緩存
    // maxAge: 31536000,
    maxAge: 0, //緩存時間 開發建議設0 跳坑
    buffer: false, // 是否緩存到内存 默認prod 緩存
  };

  // 缓存
  config.cache = {
    default: 'memory',
    stores: {
      memory: {
        driver: 'memory',
        max: 100,
        ttl: 0,
      },
    },
  };

  // 错误处理
  config.onerror = {
    // all(err, ctx) {
    //   // 在此处定义针对所有响应类型的错误处理方法
    //   // 注意，定义了 config.all 之后，其他错误处理方法不会再生效
    //   ctx.body = 'error';
    //   ctx.status = 500;
    // },
    html(err, ctx) {
      // html hander
      ctx.body = '<h3>' + err + '</h3>';
      ctx.status = 500;
    },
    json(err, ctx) {
      // json hander
      ctx.body = { code: 1000,msg: err };
      ctx.status = 500;
    },
    jsonp(err, ctx) {
      // 一般来说，不需要特殊针对 jsonp 进行错误定义，jsonp 的错误处理会自动调用 json 错误处理，并包装成 jsonp 的响应格式
    },
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
