'use strict';

module.exports = app => {

  const { STRING, INTEGER } = app.Sequelize;

  const Region = app.model.define('Region',
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
      parent_id: {
        type: INTEGER(11),
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
      tableName: 'ilock_region',
      // 自定义表名
      // freezeTableName: true,
    });

  Region.associate = () => {
    Region.hasMany(app.model.Region,{ foreignKey: 'parent_id', sourceKey: 'id', as: 'pr' });
  };

  return Region;

};

