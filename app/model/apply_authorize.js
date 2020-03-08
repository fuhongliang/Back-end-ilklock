'use strict';

module.exports = app => {

  const { STRING, INTEGER ,BIGINT,TEXT } = app.Sequelize;

  const ApplyAuthorize = app.model.define('ApplyAuthorize',
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
      user_id: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: 0
      },
      lock_id: {
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
      },
    },
    {
      tableName: 'ilock_apply_authorize',
      // 自定义表名
      // freezeTableName: true,
    });

  ApplyAuthorize.associate = () => {
    ApplyAuthorize.belongsTo(app.model.Lock,{foreignKey: 'lock_id', targetKey: 'id', as: 'lock'});
    ApplyAuthorize.belongsTo(app.model.User,{foreignKey: 'user_id', targetKey: 'id', as: 'user'});
    ApplyAuthorize.belongsTo(app.model.User,{foreignKey: 'audit_id', targetKey: 'id', as: 'audit'});
    ApplyAuthorize.belongsTo(app.model.LockSecret,{foreignKey: 'work_no', targetKey: 'work_no', as: 'secret'});
  };

  return ApplyAuthorize;

};

