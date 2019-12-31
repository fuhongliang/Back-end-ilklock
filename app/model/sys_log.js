'use strict';

module.exports = app => {

  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;

  const SysLog = app.model.define('SysLog', {
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
    user_id: {
      type: INTEGER(11),
      allowNull: false,
      defaultValue: 0
    },
    path: {
      type: STRING(255),
      allowNull: false,
      defaultValue: 0
    },
    params: {
      type: TEXT,
      allowNull: true,
    },
    response_text: {
      type: TEXT,
      allowNull: true,
    },
    create_at: {
      type: DATE,
      allowNull: false,
    }
  }, {
    tableName: 'ilock_sys_log',
  });

  SysLog.associate = function(){};

  return SysLog;

};

