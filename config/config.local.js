module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // 配置数据库
  config.sequelize = {
    // 单数据库信息配置
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'ilock',
    username:"root",
    password:"123456",
    define: {
      freezeTableName: false,
      createdAt: false,
      updatedAt: false
    },
    operatorsAliases: true
  };

  return {
    ...config,
  };

};
