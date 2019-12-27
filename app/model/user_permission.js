'use strict';

module.exports = app => {

  const { STRING, INTEGER } = app.Sequelize;

  const UserPermission = app.model.define('UserPermission',
    {
      id: {
        type: INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: 0
      },
      permission_id: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: 0
      },
    },
    {
      tableName: 'ilock_user_permission',
      // 自定义表名
      // freezeTableName: true,
    });

  UserPermission.associate = function(){};

  return UserPermission;

};

