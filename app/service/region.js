'use strict';

const path = require('path');
const Service = require(path.join(process.cwd(),'app/service/baseService'));

class RegionService extends Service{

  /**
   * 获取所有区域
   * @returns {Promise<{msg: string, code: number, data: {list: *}}>}
   */
  async allArea(mch_id){
    const { app } = this;
    const { Region } = app.model;

    const list = await Region.findAll({
      where: {
        is_delete: 0,
        mch_id: mch_id
      }
    });
    let new_list = {};

    if (list){
      for (let item of list.toJSON()){
        if (!new_list[item.parent_id]){
          new_list[item.parent_id] = [];
        }
        new_list[item.parent_id].push(item);
      }
    }
    return new_list
  }

  async getNonParentArea(){

  }
}

module.exports = RegionService;
