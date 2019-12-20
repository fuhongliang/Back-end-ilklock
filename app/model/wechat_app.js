'use strict';

module.exports = app => {

  const { STRING, INTEGER } = app.Sequelize;

  const WechatApp = app.model.define('WechatApp',
    {
      id: {
        type: INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      appid: {
        type: STRING(255),
        allowNull: false
      },
      appsecret: {
        type: STRING(255),
        allowNull: false
      }
    },
    {
      tableName: 'ilock_wechat_app',
      // 自定义表名
      // freezeTableName: true,
    });

  WechatApp.associate = function(){};

  return WechatApp;

};

