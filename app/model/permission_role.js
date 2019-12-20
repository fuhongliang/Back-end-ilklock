'use strict';

module.exports = app => {

  const { STRING, INTEGER } = app.Sequelize;

  const PermissionRole = app.model.define('PermissionRole',
    {
      id: {
        type: INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      roleid: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: '0'
      },
      permissionid: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: '0'
      },
      is_delete: {
        type: INTEGER(1),
        allowNull: false,
        defaultValue: '0'
      }
    },
    {
      tableName: 'ilock_permission_role',
      // 自定义表名
      // freezeTableName: true,
    });

  PermissionRole.associate = function(){};

  return PermissionRole;

};

