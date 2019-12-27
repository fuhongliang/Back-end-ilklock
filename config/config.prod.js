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

  return {
    ...config,
  };

};
