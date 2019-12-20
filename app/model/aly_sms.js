'use strict';

module.exports = app => {

  const { STRING, INTEGER } = app.Sequelize;

  const AlySms = app.model.define('AlySms',
    {
      id: {
        type: INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      access_key_id: {
        type: STRING(255),
        allowNull: false
      },
      access_secret: {
        type: STRING(255),
        allowNull: false
      },
      sign_name: {
        type: STRING(255),
        allowNull: false
      },
      sms_code: {
        type: STRING(255),
        allowNull: false
      }
    },
    {
      tableName: 'ilock_aly_sms',
      // 自定义表名
      // freezeTableName: true,
    });

  AlySms.associate = function(){};

  return AlySms;

};

