'use strict';

module.exports = app => {

  const { STRING, INTEGER } = app.Sequelize;

  const Admin = app.model.define('Admin',
    {
      id: {
          type: INTEGER(11),
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
      },
      username: {
          type: STRING(15),
          allowNull: false
      },
      password: {
          type: STRING(255),
          allowNull: false
      },
      level: {
          type: INTEGER(1),
          allowNull: false,
          defaultValue: 0
      },
      roleid: {
          type: INTEGER(11).UNSIGNED,
          allowNull: false,
          defaultValue: 0
      },
      name: {
          type: STRING(25),
          allowNull: false,
          defaultValue: ''
      },
      phone: {
          type: STRING(255),
          allowNull: false,
          defaultValue: ''
      },
      is_delete: {
          type: INTEGER(1),
          allowNull: false,
          defaultValue: 0
      }
    },
    {
      tableName: 'ilock_admin',
      // 自定义表名
      // freezeTableName: true,
    });

  Admin.associate = function(){};

  return Admin;

};

