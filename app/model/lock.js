'use strict';

module.exports = app => {

  const { STRING, INTEGER, BIGINT } = app.Sequelize;

  const Lock = app.model.define('Lock',
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
        defaultValue: 0
      },
      is_delete: {
        type: INTEGER(1),
        allowNull: false,
        defaultValue: 0
      },
      is_check: {
        type: INTEGER(1),
        allowNull: false,
        defaultValue: 0
      },
      addtime: {
        type: BIGINT,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      tableName: 'ilock_lock',
      // 自定义表名
      // freezeTableName: true,
    });

  // 定义关联关系
  Lock.associate = () => {
    Lock.belongsTo(app.model.Region,{foreignKey: 'region_id', targetKey: 'id', as: 'area'});
    Lock.belongsTo(app.model.Company,{foreignKey: 'com_id', targetKey: 'id', as: 'com'});
  };




  return Lock;

};

