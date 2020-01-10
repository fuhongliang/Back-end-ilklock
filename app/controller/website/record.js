'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class RecordController extends BaseController {

  async operateList() {
    const { ctx, app } = this;
    const { record } = ctx.service;
    const { user_name, lock_name, region_id, start_time, end_time } = ctx.query;
    const user = app.userInfo;
    let where = { company: user.com_id };
    if (start_time || end_time){
      where.log_time = { [app.Sequelize.Op.between]: [start_time?new Date(start_time).getTime():0,end_time?new Date(end_time).getTime():Date.now()] }
    }
    if (user_name){
      where['$User.name$'] = { [app.Sequelize.Op.like]: `%${user_name}%`} ;
    }
    if (lock_name){
      where['$Lock.name$'] = { [app.Sequelize.Op.like]: `%${lock_name}%`} ;
    }
    if (region_id){
      where['$Lock.area.id$'] = region_id;
    }

    const list = await record.getListRecord(where,ctx.query);
    await ctx.render('record/operate-list',{ list: JSON.stringify(list.rows), count: list.count, page_size: list.pageSize, query: ctx.query });
  }

}

module.exports = RecordController;
