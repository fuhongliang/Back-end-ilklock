'use strict';

module.exports = app => {

  const { STRING, INTEGER } = app.Sequelize;

  const Mch = app.model.define('Mch',
    {
      id: {
        type: INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      mch_name: {
        type: STRING(25),
        allowNull: false,
        defaultValue: ''
      },
      name: {
        type: STRING(25),
        allowNull: false,
        defaultValue: ''
      },
      phone: {
        type: STRING(25),
        allowNull: false,
        defaultValue: ''
      },
      address: {
        type: STRING(1000),
        allowNull: false
      },
      is_checked: {
        type: INTEGER(1),
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
      tableName: 'ilock_mch',
      // 自定义表名
      // freezeTableName: true,
    });

  Mch.associate = function(){};

  return Mch;

};

