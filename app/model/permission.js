'use strict';

module.exports = app => {

  const { STRING, INTEGER } = app.Sequelize;

  const Permission = app.model.define('Permission',
    {
      id: {
        type: INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: STRING(25),
        allowNull: false
      },
      route: {
        type: STRING(255),
        allowNull: false
      },
    },
    {
      tableName: 'ilock_permission',
      // 自定义表名
      // freezeTableName: true,
    });

  Permission.associate = function(){};

  return Permission;

};

