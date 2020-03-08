'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class RecordController extends BaseController {

  async operateList() {
    const { ctx, app } = this;
    const { record } = ctx.service;
    const user = app.userInfo;
    let where = { user : user.id };
    const data = await record.getListRecord(where,ctx.request.body);
    ctx.body = {
      code: 0,
      msg: 'success',
      data: {
        count: data.count,
        page_size: data.pageSize,
        list: data.rows
      }
    }
  }

  async log(){
    const { ctx } = this;
    const { record } = ctx.service;
    const { key_id, ciper_logs } = ctx.request.body;

    await record.insertLogs(key_id, ciper_logs);
    ctx.body = {
      code: 0,
      msg: 'success',
    }
  }

}

module.exports = RecordController;
