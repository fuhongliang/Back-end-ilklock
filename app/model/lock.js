'use strict';

module.exports = app => {

  const { STRING, INTEGER } = app.Sequelize;

  const Lock = app.model.define('Lock',
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
      name: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ''
      },
      lock_no: {
        type: STRING(255),
        allowNull: false
      },
      region_id: {
        type: INTEGER(11),
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
      tableName: 'ilock_lock',
      // 自定义表名
      // freezeTableName: true,
    });

  Lock.associate = function(){};

  return Lock;

};

