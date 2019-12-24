'use strict';

const path = require('path');
const Service = require(path.join(process.cwd(),'app/service/baseService'));

class RegionService extends Service{

  // async list
  async allArea(){
    const { ctx, app } = this;
    const { access_token } = ctx.request.body;
    const { Region } = app.model;
    const user = app.cache.get( access_token + '-user');
    const list = await Region.findAll({
      where: {
        is_delete: 0,
        mch_id: user.mch_id
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
    return {
      code: 0,
      msg: 'success',
      data: {
        list: new_list
      }
    }
  }
}

module.exports = RegionService;
