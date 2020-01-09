'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class RecordController extends BaseController {

  async operateList() {
    const { ctx, app } = this;
    const { record } = ctx.service;
    const user = app.userInfo;

    const data = await record.getListRecord({ user_id : user.id },ctx.request.body);
    ctx.body = {
      code: 0,
      msg: 'success',
      data: {
        list: data
      }
    }
  }

  async log(){
    const { ctx } = this;
    const { record } = ctx.service;
    const { key_id, ciper_log } = ctx.request.body;
    await record.insertLogs(key_id, ciper_log);
    ctx.body = {
      code: 0,
      msg: 'success',
    }
  }

}

module.exports = RecordController;
