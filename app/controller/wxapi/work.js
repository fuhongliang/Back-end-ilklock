'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class WorkController extends BaseController {

  // 获取开始作业
  async listWork(){
    this.ctx.body = await this.ctx.service.work.list();
  }

  async finish() {
    this.ctx.body = await this.ctx.service.work.finish();
  }

  async startWork(){
    this.ctx.body = await this.ctx.service.work.getWorkLocks();
  }
}
module.exports = WorkController;
