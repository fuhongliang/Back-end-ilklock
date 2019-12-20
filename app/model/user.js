'use strict';

module.exports = app => {

  const { STRING, INTEGER, BIGINT } = app.Sequelize;

  const User = app.model.define('User',
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
      username: {
        type: STRING(25),
        allowNull: false,
        unique: true
      },
      password: {
        type: STRING(255),
        allowNull: false
      },
      job_no: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ''
      },
      level: {
        type: INTEGER(2),
        allowNull: false
      },
      roleid: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: '0'
      },
      name: {
        type: STRING(25),
        allowNull: false,
        defaultValue: ''
      },
      pinyin: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ''
      },
      addtime: {
        type: BIGINT,
        allowNull: false,
        defaultValue: '0'
      },
      review_time: {
        type: BIGINT,
        allowNull: false,
        defaultValue: '0'
      },
      phone: {
        type: STRING(25),
        allowNull: false,
        defaultValue: ''
      },
      is_delete: {
        type: INTEGER(1),
        allowNull: false
      },
      is_check: {
        type: INTEGER(1),
        allowNull: false,
        defaultValue: '0'
      }
    },
    {
      tableName: 'ilock_user',
      // 自定义表名
      // freezeTableName: true,
    });

  User.associate = function(){};

  return User;

};

