'use strict';

module.exports = app => {

  const { STRING, INTEGER ,BIGINT } = app.Sequelize;

  const ApplyWork = app.model.define('ApplyWork',
    {
      id: {
        type: INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      lock_mode_id: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: 0
      },
      user_id: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: 0
      },
      audit_id: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: 0
      },
      work_no: {
        type: STRING(20),
        allowNull: false,
      },
      duration: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: 0
      },
      start_time: {
        type: BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      end_time: {
        type: BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      addtime: {
        type: BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      type: {
        type: INTEGER(1),
        allowNull: false,
        defaultValue: 0
      },
      status: {
        type: INTEGER(2),
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
      tableName: 'ilock_apply_work',
      // 自定义表名
      // freezeTableName: true,
    });

  ApplyWork.associate = () => {

  };

  return ApplyWork;

};

