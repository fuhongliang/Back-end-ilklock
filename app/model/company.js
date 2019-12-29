'use strict';

module.exports = app => {

  const { STRING, INTEGER } = app.Sequelize;

  const Company = app.model.define('Company',
    {
      id: {
        type: INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      com_name: {
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
        defaultValue: 0
      },
      is_delete: {
        type: INTEGER(1),
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      tableName: 'ilock_company',
      // 自定义表名
      // freezeTableName: true,
    });

  Company.associate = function(){};

  return Company;

};

