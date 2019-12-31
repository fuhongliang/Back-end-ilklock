'use strict';

const path = require('path');
const Service = require(path.join(process.cwd(),'app/service/baseService'));

class RegionService extends Service{

  /**
   * 获取所有区域
   * @returns {Promise<{msg: string, code: number, data: {list: *}}>}
   */
  async allArea(com_id){

    const { app } = this;
    const { Region } = app.model;

    const list = await Region.findAll({
      where: {
        is_delete: 0,
        com_id: com_id
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

  async getChildArea(){
    const { ctx, app } = this;
    const { Region } = app.model;
    const { id = 0 } = ctx.request.body;
    const user = app.userInfo;

    return Region.findAll({
      where: {
        com_id: user.com_id,
        is_delete: 0,
        parent_id: id
      },
      attributes: ['id', 'name'],
    });
  }
}

module.exports = RegionService;
