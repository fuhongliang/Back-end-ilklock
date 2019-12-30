'use strict';

module.exports = app => {

  const { STRING, BIGINT, TEXT } = app.Sequelize;

  const AuthLogin = app.model.define('AuthLogin', {
    id: {
      type: STRING(32),
      allowNull: false,
      primaryKey: true,
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
    createdAt: true
  });

  AuthLogin.associate = function(){};

  return AuthLogin;

};

