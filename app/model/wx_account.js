'use strict';

module.exports = app => {

  const { STRING, INTEGER } = app.Sequelize;

  const WxAccount = app.model.define('WxAccount', {
    id: {
      type: INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nickname: {
      type: STRING(25),
      allowNull: false,
      defaultValue: ''
    },
    avatar: {
      type: STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    openid: {
      type: STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    unionid: {
      type: STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    user_id: {
      type: INTEGER(11),
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'ilock_wx_account'
  });

  WxAccount.associate = function(){};

  return WxAccount;

};

