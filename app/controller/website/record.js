'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class RecordController extends BaseController {

  async operateList() {
    const { ctx, app } = this;
    const { record } = ctx.service;
    const { user_name, lock_name, region_id, start_time, end_time } = ctx.query;
    let where = {

    };
    const user = app.userInfo;
    const list = await record.getListRecord({ company: user.com_id },ctx.query);
    await ctx.render('record/operate-list',{ list: JSON.stringify(list)});
  }

}

module.exports = RecordController;
