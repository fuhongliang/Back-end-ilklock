'use strict';

module.exports = app => {

  const { STRING, INTEGER ,TEXT, BIGINT } = app.Sequelize;

  const LockSecret = app.model.define('LockSecret',
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
      work_no: {
        type: STRING(20),
        allowNull: false,
      },
      secret_key: {
        type: TEXT,
        allowNull: false
      },
      lock_no: {
        type: STRING(255),
        allowNull: false,
      },
      start_time: {
        type: BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      expire_time: {
        type: BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      is_delete: {
        type: INTEGER(1),
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      tableName: 'ilock_lock_secret',
      // 自定义表名
      // freezeTableName: true,
    });

  LockSecret.associate = function(){};

  return LockSecret;

};
