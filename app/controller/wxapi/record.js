'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class RecordController extends BaseController {

  async operateList() {
    const { ctx } = this;
    const { id, page = 1, page_size = 10 } = ctx.request.body;
    const { record } = ctx.service;
    const data = await record.getOperateRecordByUser(id,{ page: parseInt(page), page_size: parseInt(page_size)});
    ctx.body = {
      code: 0,
      msg: 'success',
      data: {
        list: data
      }
    }
  }

}

module.exports = RecordController;
