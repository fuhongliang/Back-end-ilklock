'use strict';

module.exports = app => {

  const { STRING, INTEGER,BIGINT } = app.Sequelize;

  const LockLog = app.model.define('LockLog',
    {
      id: {
        type: INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      lock_id: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: '0'
      },
      user_id: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: '0'
      },
      addtime: {
        type: BIGINT,
        allowNull: false,
        defaultValue: '0'
      },
      status: {
        type: STRING(5),
        allowNull: false,
        defaultValue: '读码'
      },
      is_delete: {
        type: INTEGER(1),
        allowNull: false,
        defaultValue: '0'
      }
    },
    {
      tableName: 'ilock_lock_log',
      // 自定义表名
      // freezeTableName: true,
    });

  LockLog.associate = function(){};

  return LockLog;

};
