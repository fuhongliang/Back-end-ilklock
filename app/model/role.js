'use strict';

module.exports = app => {

  const { STRING, INTEGER, BIGINT, TEXT } = app.Sequelize;

  const Role = app.model.define('Role', {
    id: {
      type: INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    com_id: {
      type: INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    name: {
      type: STRING(25),
      allowNull: false,
      defaultValue: ''
    },
    desc: {
      type: TEXT,
      allowNull: true,
    },
    addtime: {
      type: BIGINT,
      allowNull: false,
      defaultValue: '0'
    },
    is_delete: {
      type: INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: 'ilock_role'
  });

  Role.associate = function(){};

  return Role;

};

