'use strict';

module.exports = app => {

  const { STRING, INTEGER ,TEXT, BIGINT } = app.Sequelize;

  const LockMode = app.model.define('LockMode',
    {
      id: {
        type: INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      com_id: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: 0
      },
      name: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ''
      },
      locks: {
        type: TEXT,
        allowNull: false
      },
      type: {
        type: INTEGER(1),
        allowNull: false,
        defaultValue: 1
      },
      is_delete: {
        type: INTEGER(1),
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      tableName: 'ilock_lock_mode',
      // 自定义表名
      // freezeTableName: true,
    });

  LockMode.associate = function(){};

  return LockMode;

};
