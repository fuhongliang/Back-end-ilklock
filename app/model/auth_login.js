'use strict';

module.exports = app => {

  const { STRING, BIGINT, TEXT, INTEGER } = app.Sequelize;

  const AuthLogin = app.model.define('AuthLogin', {
    id: {
      type: INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: INTEGER(11),
      allowNull: false,
      defaultValue: 0
    },
    key: {
      type: STRING(32),
      allowNull: false,
      defaultValue: ''
    },
    type: {
      type: STRING(25),
      allowNull: false,
      defaultValue: ''
    },
    expire_time: {
      type: BIGINT(20),
      allowNull: false,
      defaultValue: 0
    },
    data: {
      type: TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'ilock_auth_login',
  });

  AuthLogin.associate = function(){};

  return AuthLogin;

};

