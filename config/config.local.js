module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // 配置数据库
  // const Op = require('sequelize').Op;
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
  };

  return {
    ...config,
  };

};
