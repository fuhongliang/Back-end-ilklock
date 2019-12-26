'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class IndexController extends BaseController {
  async index(){
    const { ctx } = this;

    const { id = 0 } = ctx.request.body;
    // const records = await ctx.service.record.getOperateRecordById(id,{ page: 1, page_size: 5});
  }
}

module.exports = IndexController;
