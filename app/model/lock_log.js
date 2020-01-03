'use strict';

module.exports = app => {

  const { STRING, INTEGER,DATE } = app.Sequelize;

  const LockLog = app.model.define('LockLog',
    {
      id: {
        type: INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      key_id: {
        type: STRING(25),
        allowNull: false,
        defaultValue: ''
      },
      key_status: {
        type: INTEGER(2),
        allowNull: false,
        defaultValue: 0
      },
      log_time: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: 0
      },
      log_version: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: 0
      },
      log_order: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: 0
      },
      company: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: 0
      },
      user: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: 0
      },
      user_addition: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: 0
      },
      locks: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: 0
      },
      sensor_status: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: 0
      },
      soft_status: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: 0
      },
      log_code: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: 0
      },
      create_at: {
        type: DATE,
        allowNull: false,
        defaultValue: '0000-00-00 00:00:00'

      },
    },
    {
      tableName: 'ilock_lock_log',
      // 自定义表名
      // freezeTableName: true,
    });

  // 定义关联关系
  LockLog.associate = () => {
    LockLog.belongsTo(app.model.Lock,{foreignKey: 'locks', targetKey: 'id'});
  };


  return LockLog;

};
