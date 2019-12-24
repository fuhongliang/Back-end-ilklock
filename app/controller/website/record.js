'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class RecordController extends BaseController {
  async operateList() {
    const { ctx } = this;
    await ctx.render('record/operate-list');
  }

}

module.exports = RecordController;
