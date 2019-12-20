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
      mch_id: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: '0'
      },
      user_id: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: '0'
      },
      lock_id: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: '0'
      },
      group_id: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: '0'
      },
      secret_key: {
        type: TEXT,
        allowNull: false
      },
      expiry_time: {
        type: BIGINT,
        allowNull: false,
        defaultValue: '0'
      },
      type: {
        type: INTEGER(1),
        allowNull: false
      },
      status: {
        type: INTEGER(2),
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
      tableName: 'ilock_apply_authorize',
      // 自定义表名
      // freezeTableName: true,
    });

  ApplyAuthorize.associate = function(){};

  return ApplyAuthorize;

};

