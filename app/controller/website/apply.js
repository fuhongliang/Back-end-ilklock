'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class ApplyController extends BaseController {

  /**
   * 申请列表
   * @returns {Promise<void>}
   */
  async list() {
    const { ctx } = this;
    const { apply } = ctx.service;
    const list = await apply.listApply();
    await ctx.render('apply/list',{ list: JSON.stringify(list.rows), count: list.count, page_size: list.pageSize });
  }

  async review() {
    const { ctx } = this;
    const { apply } = ctx.service;
    ctx.body = await apply.review();
  }

}

module.exports = ApplyController;
